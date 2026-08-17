---
layout: post
title: "From Memory to Photonics: Solving the Next Bottleneck in AI Scaling"
date: 2026-06-25
description: "A systems view connecting FlashAttention's IO-aware lesson to distributed communication, WDM, optical I/O, and compact inverse-designed photonic devices."
tags: [ml, llm, systems, systems-infrastructure, hardware, photonics, from-scratch]
categories: [technical-blogs]
thumbnail: /assets/img/blog_img/photonics-scaling/photonics_layer.png
featured: true
_styles: |
  .asset-figure {
    margin: 1.4rem 0;
    text-align: center;
  }

  .asset-figure img {
    max-width: 940px;
    width: 94%;
    height: auto;
    border: 1px solid rgba(33, 53, 64, 0.12);
    border-radius: 8px;
    background: #fff;
  }

  .asset-figure.wide img {
    max-width: 1080px;
    width: 98%;
  }

  .asset-figure.dark img {
    background: #050505;
  }

  .asset-figure p {
    margin-top: 0.5rem;
    color: #66757f;
    font-size: 0.92rem;
  }

  .post-byline {
    margin: -0.35rem 0 0.15rem;
    color: #53666e;
    font-size: 0.98rem;
  }

  .constraint-list {
    margin: 1.15rem 0 1.65rem;
    border-top: 1px solid var(--global-divider-color);
  }

  .constraint-list > div {
    display: grid;
    grid-template-columns: minmax(8.5rem, 0.28fr) 1fr;
    gap: 1.25rem;
    padding: 0.85rem 0;
    border-bottom: 1px solid var(--global-divider-color);
  }

  .constraint-list dt {
    color: var(--global-theme-color);
    font-weight: 650;
  }

  .constraint-list dd {
    margin: 0;
    color: var(--global-text-color);
  }

  .movement-map {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.8rem;
    margin: 1.2rem 0 1.6rem;
  }

  .movement-map div {
    padding: 0.9rem 1rem;
    border: 1px solid var(--global-divider-color);
    border-top: 2px solid var(--global-theme-color);
    border-radius: 8px;
    background: var(--global-code-bg-color);
    color: var(--global-text-color);
  }

  .movement-map strong {
    display: block;
    margin-bottom: 0.25rem;
    color: var(--global-theme-color);
  }

  .tradeoff-table {
    margin: 1.25rem 0 1.5rem;
    overflow-x: auto;
  }

  .tradeoff-table table {
    min-width: 760px;
    margin: 0;
  }

  .tradeoff-table th,
  .tradeoff-table td {
    padding: 0.7rem 0.8rem;
    vertical-align: top;
  }

  .tradeoff-table th {
    background: var(--global-code-bg-color);
    color: var(--global-text-color);
    border-bottom: 2px solid var(--global-theme-color);
  }

  .tradeoff-table td:first-child strong {
    color: var(--global-theme-color);
  }

  html[data-theme="dark"] .asset-figure img {
    border-color: rgba(255, 255, 255, 0.14);
  }

  @media (max-width: 575px) {
    .constraint-list > div {
      grid-template-columns: 1fr;
      gap: 0.15rem;
      padding: 0.75rem 0;
    }

    .movement-map {
      grid-template-columns: 1fr;
    }
  }

---

<p class="post-byline">With <a href="https://punhojark.github.io/">Junho Park</a> (<a href="https://lsip.engin.umich.edu/">Di Liang Lab</a>, University of Michigan)</p>

In the [previous post]({% post_url 2026-06-23-training-lm-from-scratch-part2-flashattention-memory %}), I used FlashAttention to show how exact attention can be computed with less data transfer between HBM and on-chip memory.

When a model outgrows one accelerator, we distribute its work across many devices:

- **tensor parallelism** exchanges intermediate activations
- **data parallelism** synchronizes gradients
- **pipeline parallelism** sends activations between stages
- **mixture-of-experts models** create all-to-all routing patterns
- **inference systems** can shard weights or KV cache across devices

These strategies let the system scale, but they do not remove movement. Activations, gradients, expert routes, weights, and cache state still cross between devices.

## The next bottleneck is movement

Once data leaves one accelerator, performance depends on the physical link carrying it. Algorithms can reduce the traffic, but the remaining bits still have to cross between devices, servers, and racks. Photonics changes that link.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/photonics_layer.png' | relative_url }}"
    alt="Hierarchy showing FlashAttention inside an accelerator and photonics between accelerators, servers, racks, and data centers"
  />
  <p>FlashAttention changes how data moves inside an accelerator. Photonics changes the physical link for data that must move between accelerators, servers, racks, and data centers.</p>
</div>

---

## One system, three bottlenecks

At the system level, we can separate the constraints into three buckets:

<dl class="constraint-list">
  <div>
    <dt>Compute</dt>
    <dd>How many useful operations can the accelerator perform per second?</dd>
  </div>
  <div>
    <dt>Memory</dt>
    <dd>How quickly can one accelerator obtain and reuse its local data?</dd>
  </div>
  <div>
    <dt>Communication</dt>
    <dd>How quickly can many accelerators exchange data and coordinate?</dd>
  </div>
</dl>

The raw matmul engines are extremely fast and heavily optimized. A kernel with enough arithmetic intensity and reuse can still be compute-bound, but many important workloads instead run into the problem of feeding and coordinating those engines.

Roofline-style reasoning helps separate these cases. It asks how much math we obtain per byte moved and whether runtime is limited by compute throughput, memory bandwidth, communication bandwidth, or capacity. The [JAX Scaling Book roofline chapter](https://jax-ml.github.io/scaling-book/roofline/) gives a good introduction.

FlashAttention mostly addresses the second constraint. It reduces unnecessary traffic between HBM and on-chip memory.

Photonics mostly enters through the third constraint.

---

## Scaling changes the bottleneck

As the system becomes physically larger, communication becomes a larger part of the bottleneck.

Physical systems also grow along three axes. Vendor definitions vary, so we can use these terms as a rough map:

<div class="movement-map">
  <div>
    <strong>Scale up</strong>
    Connect more accelerators inside a tightly coupled system or rack.
  </div>
  <div>
    <strong>Scale out</strong>
    Connect systems and racks into a larger cluster.
  </div>
  <div>
    <strong>Scale across</strong>
    Connect data centers or campuses over longer distances.
  </div>
</div>

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/data_center_scale.png' | relative_url }}"
    alt="Hand-drawn diagram showing scale-up, scale-out, and scale-across directions for data-center infrastructure"
  />
  <p>Each direction adds compute, but it also adds links and makes communication a larger part of the machine.</p>
</div>

---

## Where copper gets expensive

Many short electrical links are copper-based. Copper is inexpensive, mature, familiar to package designers, and efficient over short distances.

The difficulty appears when distance, signaling rate, and lane density all rise together.

At higher frequencies, conductor and dielectric losses grow. The channel has less margin, so the link may need more equalization, stronger drivers, retimers, or DSP. Those additions consume power and occupy package or board area. The resulting heat becomes part of the same cooling and reliability problem as the accelerators themselves.

The first plot shows the broad reach-versus-rate trend. It is qualitative because the crossover depends on the implementation.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/reach_vs_rate_annotated.png' | relative_url }}"
    alt="Reach versus data rate comparison for passive copper and fiber"
  />
  <p>Passive copper loses reach quickly as the per-lane data rate rises. Fiber preserves much more reach. See Coherent's <a href="https://cdn.prod.website-files.com/67b66b7d2a3d3a0f9c895fbd/67debb9322330cf373d1c5d2_Technology%20Innovation%20Briefing%20-%20Final.pdf">technology briefing</a> for the industry context.</p>
</div>

The next figure puts those reaches into package, board, and rack context.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/interconnect_length.png' | relative_url }}"
    alt="Hand-drawn diagram of interconnect lengths from package scale to board scale to rack scale"
  />
  <p>Interconnect distances from OIF's <em>Next Generation CEI-224G Framework</em>, Table 4 (<a href="https://www.oiforum.com/wp-content/uploads/OIF-FD-CEI-224G-01.0.pdf">source</a>).</p>
</div>

This does not mean copper suddenly stops working. It means the cost of making it work rises when we ask for more bandwidth over more distance with less energy.

Copper is often excellent for short, inexpensive electrical links. Optics becomes more attractive as reach, aggregate bandwidth, and lane density rise together.

The attraction is not simply that light is fast. Electrical signals in copper also propagate at a significant fraction of the speed of light. For AI interconnects, the practical advantages are often reach, signal integrity, bandwidth density, and energy per bit.

---

## The optical boundary is moving toward compute

Data centers already use fiber for longer reaches. Every optical link still has electrical endpoints, so the system needs a point where the signal changes from electrical to optical. The current pressure is to move that conversion point closer to the ASIC.

The progression is usually described as **pluggable optics → on-board optics → co-packaged optics → optical I/O**. From left to right, the difficult electrical path gets shorter, while system integration and fabrication complexity generally increase.

<div class="tradeoff-table">
  <table>
    <thead>
      <tr>
        <th>Architecture</th>
        <th>Where optics sits</th>
        <th>Main benefit</th>
        <th>Main cost</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Pluggable optics</strong></td>
        <td>Replaceable module at the front panel</td>
        <td>Mature and serviceable</td>
        <td>Longest remaining high-speed electrical path</td>
      </tr>
      <tr>
        <td><strong>On-board optics</strong></td>
        <td>Optical engine mounted closer to the ASIC</td>
        <td>Shorter electrical reach</td>
        <td>Harder board assembly, cooling, and replacement</td>
      </tr>
      <tr>
        <td><strong>Co-packaged optics</strong></td>
        <td>Optical engines beside the ASIC in one package</td>
        <td>High bandwidth density and short electrical links</td>
        <td>Thermal coupling, fiber attach, testing, yield, and serviceability</td>
      </tr>
      <tr>
        <td><strong>Optical I/O</strong></td>
        <td>Optical chiplet or die-level proximity to compute</td>
        <td>Electrical distance approaches the die scale</td>
        <td>Deepest integration and tightest manufacturing constraints</td>
      </tr>
    </tbody>
  </table>
</div>

Moving from left to right can improve bandwidth density and energy efficiency, but it also pulls the optics into the computer package. The failure model shifts from replacing a module toward reworking or replacing a package. Photonic devices sit closer to a hot ASIC, and alignment, fiber attachment, known-good-die testing, and combined yield become more consequential.

Two metrics make the tradeoff concrete:

<dl class="constraint-list">
  <div>
    <dt>Energy per bit</dt>
    <dd>How much total energy does the link spend to move one bit? Lower is better.</dd>
  </div>
  <div>
    <dt>Shoreline bandwidth density</dt>
    <dd>How much bandwidth can cross each millimeter of package edge? Higher is better.</dd>
  </div>
</dl>

Closeness alone does not guarantee a better link. Lasers, modulators, drivers, detectors, DSP, coupling loss, and thermal control all contribute to the total energy.

The integration ladder is therefore a tradeoff. Shorter electrical reach helps energy and bandwidth density, while packaging, thermal management, testing, and yield become harder.

---

## How an optical link works

Moving the conversion point does not remove electronics. It compresses this chain into a smaller physical distance:

~~~text
electrical data
    -> electro-optic modulation
    -> optical waveguide or fiber
    -> photodetection
    -> electrical data
~~~

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/photonics_as_solution.png' | relative_url }}"
    alt="Diagram showing electrical-to-optical conversion, optical transmission through fiber, and optical-to-electrical conversion"
  />
  <p>The accelerator remains electronic. Photonics changes the communication path between endpoints.</p>
</div>

A laser supplies an optical carrier, and a modulator writes electrical data onto that light. In one common Mach-Zehnder-style design, an applied voltage changes the refractive index in one optical path, which changes its phase. When the two paths recombine, interference converts the relative phase into an intensity that a detector can read.

The Mach-Zehnder example gives us a useful mental model. Other electro-optic modulators use different structures.

There is a material problem too. Silicon is excellent for CMOS manufacturing and optical waveguides, but its indirect bandgap makes it an inefficient light source. Practical systems may use III-V materials such as indium phosphide, integrated through heterogeneous bonding, or keep the laser external to the silicon photonics die. Either choice moves complexity rather than eliminating it.

### Wavelength is an extra axis

Optics also gives the link a wavelength dimension. With wavelength-division multiplexing, or WDM, several wavelengths can be modulated independently and sent through the same physical waveguide or fiber.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/wdm_vs_electrical.svg' | relative_url }}"
    alt="Comparison of parallel electrical lanes with several wavelength channels sharing one optical waveguide"
  />
  <p>Electrical links often scale through faster signaling, more lanes, or both. WDM adds independently modulated wavelengths to one physical optical path.</p>
</div>

Electrical links can also encode multiple bits per symbol and use frequency-domain techniques. The distinction is not that copper carries only one bit or one kind of information. WDM provides another channel dimension without requiring a separate physical lane for each wavelength.

**Optical mux and demux components can also be passive: they can combine and separate wavelengths without active switching power.** They are not free, however. They introduce insertion loss, which must be paid for elsewhere in the link budget, often through additional laser power. Dense wavelength filters can also drift with temperature, so thermal control remains an engineering problem.

This post is about optical communication, not optical computing. The GPU or TPU still performs the matrix multiplication. Photonics helps deliver the right data to the right compute element.

**For each distance and topology, the practical question is which link should become optical first, not when everything becomes optical.** WDM improves the link's bandwidth density, which raises the next question: how much photonic functionality can fit near the package edge?

---

## Photonics has a density problem too

WDM lets one waveguide carry many wavelength channels. Those channels still have to be combined, separated, split, filtered, and routed.

That requires physical devices:

- multiplexers and demultiplexers
- power splitters and couplers
- filters
- mode converters
- wavelength routers

Conventional photonic components can be large compared with electronic logic. The scale cannot shrink like a transistor because the device must still confine and manipulate light whose wavelength is itself on the micrometer scale.

This creates a second density problem. The package has limited area, and its shoreline grows only along the perimeter. If each mux, demux, or splitter consumes too much space, WDM's theoretical channel advantage becomes harder to turn into package-level bandwidth.

More wavelengths require more routing functions, which puts more devices against a limited package edge and increases the pressure for compact, low-loss components.

That density pressure is what leads from the system problem to inverse design: smaller devices let us fit more wavelength-routing functions near the package edge and turn WDM's channel advantage into package-level bandwidth.

---

## What inverse design actually does

Conventional device design usually starts with a geometry that a human already understands. The engineer chooses a familiar splitter, coupler, or resonator, runs a simulation, changes a few dimensions, and repeats.

Inverse design reverses the starting point.

We specify the behavior we want: for example, route one wavelength to the upper output and another wavelength to the lower output with low loss and low crosstalk. A physics solver evaluates the structure, and an optimizer changes the geometry to improve an objective.

Many photonic inverse-design workflows use gradients from electromagnetic simulations, often through adjoint methods. This lets the optimizer change the full geometry instead of tuning a few hand-selected dimensions. The [SPINS inverse-design framework paper](https://arxiv.org/abs/1910.04829) gives a useful technical introduction.

The adjoint method is useful because testing one geometry pixel at a time would require thousands of simulations. For one objective, a forward solve and an adjoint solve can provide the gradient across the design region. The optimizer takes a step, runs the solver again, and repeats.

Because the optimizer follows the physics rather than a human template, it can discover compact and unintuitive structures.

That compactness is why inverse design matters to the system story. Smaller muxes, demuxes, and splitters let us place more optical functions near the package edge, increasing the amount of useful bandwidth that can cross it.

The price is a new set of optimization and manufacturing problems.

---

## Inverse design creates a second bottleneck

An optimized geometry may contain tiny holes, narrow bridges, isolated islands, or boundaries that are extremely sensitive to process variation.

The simulation can look excellent while the fabricated device behaves differently. A good simulated design is not yet a good device; the goal is a design that can be fabricated, measured, and reproduced reliably.

The practical issues include:

- the optimization can be expensive
- different starting points can converge to different local solutions
- the final geometry can be difficult for a person to interpret
- small fabrication errors can shift interference and wavelength response
- a compact design is not automatically a manufacturable or robust design

This is a different problem from attaching a laser or packaging a CPO module. It happens inside the device geometry itself. Lithography and etching cannot reproduce every boundary perfectly, and a small deviation in a sensitive region can change the device response.

Design capability and manufacturability are not the same.

If we discard every failed optimization or fabrication run and keep only the best design, we also discard information about the design space.

---

## Where our work fits

Our work explores three stages of a more scalable and evidence-driven photonic design loop:

### Learn: reuse prior optimization efforts

Archived designs can provide informed starting geometries before electromagnetic refinement.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/generative_priors_pipeline.png' | relative_url }}"
    alt="Pipeline comparing uninformed initialization with cVAE learned priors followed by FDTD adjoint optimization"
  />
  <p>Archived inverse-designed devices train a conditional VAE that proposes informed starting geometries before FDTD adjoint optimization.</p>
</div>

### Understand: identify feature sensitivity

Sensitivity analysis shows which regions of a finished device are most vulnerable to fabrication changes.

<div class="asset-figure wide dark">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/geometry_sensitivity_fabrication.png' | relative_url }}"
    alt="SEM images of inverse-designed wavelength demultiplexers with magnified fabrication deviations"
  />
  <p>Fabricated wavelength demultiplexers reveal local process deviations that motivate geometry-level sensitivity analysis.</p>
</div>

### Refine: fabrication-friendly trimming

Optimization information can rank candidate layout edits, while forward simulation verifies each accepted change.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/solver_native_trimming_workflow.png' | relative_url }}"
    alt="Workflow for solver-native attribution and iterative geometry removal verified by forward electromagnetic simulations"
  />
  <p>Solver-native attribution ranks low-impact regions for iterative removal, and forward electromagnetic solves verify each accepted change.</p>
</div>

Together, the loop is: reuse prior knowledge → identify fabrication-critical features → refine with physics-based verification.

These directions currently include one [APL Engineering Physics paper](https://pubs.aip.org/aip/aep/article/1/3/036106/3397071/Interpretable-geometry-sensitivity-for-inverse) and two [IEEE Photonics Conference 2026 oral presentations]({{ '/publications/' | relative_url }}). Our longer-term goal is an end-to-end design loop for photonic integrated circuits.

---

## Movement is part of the architecture

FlashAttention and photonics operate at different layers, but they expose the same systems lesson: useful compute depends on moving data efficiently.

Compact inverse-designed components help fit optical functions near the package edge, while fabrication-aware design helps make those components practical.

Faster arithmetic still matters, but AI scaling increasingly depends on moving information well inside one device, between devices, and across the data-center system.

---

## References

- [Training a Language Model from Scratch (Part 2: FlashAttention and Device Memory)]({% post_url 2026-06-23-training-lm-from-scratch-part2-flashattention-memory %})
- [JAX Scaling Book: Roofline](https://jax-ml.github.io/scaling-book/roofline/)
- [OIF: Next Generation CEI-224G Framework](https://www.oiforum.com/wp-content/uploads/OIF-FD-CEI-224G-01.0.pdf)
- [Coherent: Technology Innovation Briefing](https://cdn.prod.website-files.com/67b66b7d2a3d3a0f9c895fbd/67debb9322330cf373d1c5d2_Technology%20Innovation%20Briefing%20-%20Final.pdf)
- [SPINS: Nanophotonic inverse design software architecture and practical considerations](https://arxiv.org/abs/1910.04829)
- [Generative Priors Accelerate Inverse Design for Regularized, High-Performance Integrated Photonics]({{ '/publications/' | relative_url }})
- [Interpretable geometry sensitivity for inverse design of integrated photonics](https://pubs.aip.org/aip/aep/article/1/3/036106/3397071/Interpretable-geometry-sensitivity-for-inverse)
- [Solver-Native Adjoint Attribution for Trimming Inverse-Designed Photonic Layouts]({{ '/publications/' | relative_url }})
