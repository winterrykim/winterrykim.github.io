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

In the [previous post]({% post_url 2026-06-23-training-lm-from-scratch-part2-flashattention-memory %}), I used FlashAttention to show how the same attention calculation can run with less data transfer between high-bandwidth memory (HBM) and the smaller, faster memory on the processor.

When a model becomes too large for one GPU, or we want to train it faster, we distribute work across devices:

- **Tensor parallelism** splits individual operations across devices, which exchange intermediate results.
- **Data parallelism** runs model copies on different batches of data, then combines their gradients to update the model.
- **Pipeline parallelism** places successive parts of the model on different devices and passes results between them.

These strategies give us more computing power, but they also create traffic between devices.

## The next bottleneck is movement

Algorithms can reduce that traffic, but the remaining bits still need a physical link. Photonics uses light to carry and manipulate information. In an optical link, data travels on light through a fiber or a tiny channel on a chip called a waveguide.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/photonics_layer.png' | relative_url }}"
    alt="Hierarchy showing FlashAttention inside an accelerator and photonics between accelerators, servers, racks, and data centers"
  />
  <p>FlashAttention changes how data moves inside an accelerator. Photonics changes the physical link for data that must move between accelerators, servers, racks, and data centers.</p>
</div>

---

## One system, three bottlenecks

A processor can be limited by the speed of its calculations, its access to memory, or its connections to other processors:

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

Which limit matters depends on the work and how it is divided. A useful starting point is how much math we do for each byte moved: enough work per byte can keep a processor busy while the next data arrives. The [JAX Scaling Book's roofline chapter](https://jax-ml.github.io/scaling-book/roofline/) develops this idea in more detail.

---

## From chips to racks to data centers

Communication can take a larger share of runtime as work spreads across more processors and longer distances, especially when processors have to wait for each other's results.

Three terms describe these connections, though their exact boundaries vary by vendor:

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
  <p>Connections within a system, between racks, and between data centers face different distance and bandwidth requirements.</p>
</div>

---

## Where copper gets expensive

Copper is widely used for short electrical links. It is inexpensive and works well over short distances.

The difficulty comes when we want more bits per second, longer connections, and less space for cables.

At higher signaling frequencies, more energy is lost in the conductor and surrounding insulating material. Signals weaken and become harder to distinguish. Extra circuits can compensate for distortion or restore the signal along the way, but they consume power and board space and produce heat.

As the data rate rises, passive copper cables, which have no powered signal-restoring electronics, become harder to use over long distances. Optical fiber can support much longer links.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/reach_vs_rate_annotated.png' | relative_url }}"
    alt="Illustrative comparison of reach versus data rate for passive copper and optical fiber; numerical values are not verified measurements"
  />
  <p>Illustrative trend only. The plotted values and shaded bands are not verified measurements or specification limits. Actual reach depends on the cable, transmitter, receiver, and signaling method.</p>
</div>

The distance may be a few millimeters within a chip package, across a circuit board, or between racks. A package is the assembly that holds one or more chips and connects them to the rest of the computer.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/interconnect_length.png' | relative_url }}"
    alt="Hand-drawn diagram of interconnect lengths from package scale to board scale to rack scale"
  />
  <p>Interconnect distances from OIF's <em>Next Generation CEI-224G Framework</em>, Table 4 (<a href="https://www.oiforum.com/wp-content/uploads/OIF-FD-CEI-224G-01.0.pdf">source</a>).</p>
</div>

Electrical signals in copper also travel at a significant fraction of the speed of light. The advantage of optics is carrying large amounts of data over distance with manageable signal loss and energy use. There is no universal crossover point: the choice depends on the cable and the electronics at each end.

---

## The optical boundary is moving toward compute

Data centers already use fiber for longer connections. The processors remain electronic, so data must be converted into an optical signal and back. Moving that conversion closer to the processor or network switch shortens the electrical part of the journey.

The direction is **front-panel modules → optics on the circuit board → optics in the chip package**. Bringing optics closer generally makes assembly, cooling, testing, and repair more demanding.

**Optical I/O** means optical input and output for a chip. It can use a small communication chip, or chiplet, in the processor's package, so it overlaps with **co-packaged optics (CPO)**. [Intel's optical I/O demonstration](https://www.intel.com/content/www/us/en/newsroom/news/intel-unveils-first-integrated-optical-io-chiplet.html) is one example.

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
        <td>Electrical signal must still reach the front panel</td>
      </tr>
      <tr>
        <td><strong>On-board optics</strong></td>
        <td>Optical conversion hardware near the processor or switch</td>
        <td>Shorter electrical reach</td>
        <td>Harder board assembly, cooling, and replacement</td>
      </tr>
      <tr>
        <td><strong>Co-packaged optics</strong></td>
        <td>Optical conversion hardware beside the processor or switch in one package</td>
        <td>High bandwidth density and short electrical links</td>
        <td>Shared heat, fiber attachment, testing, and repair</td>
      </tr>
      <tr>
        <td><strong>Optical I/O</strong></td>
        <td>Optical interface for a chip, often using a chiplet in the same package</td>
        <td>Short electrical connection from compute to the optical interface</td>
        <td>Integration with the processor, plus package and manufacturing constraints</td>
      </tr>
    </tbody>
  </table>
</div>

An optical transceiver sends and receives data using light. Coherent's image below shows the inside of a transceiver module and how similar components can be arranged around a switch or processor.

<div class="asset-figure dark">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/coherent_optical_transceiver.png' | relative_url }}"
    alt="Coherent image showing an opened optical transceiver above a CPO illustration, with labels for electronic circuits, detectors, lasers, and passive optics"
  />
  <p>A transceiver module above and a CPO illustration below. Source: <a href="https://cdn.prod.website-files.com/67b66b7d2a3d3a0f9c895fbd/67debb9322330cf373d1c5d2_Technology%20Innovation%20Briefing%20-%20Final.pdf">Coherent's Technology Innovation Briefing</a>.</p>
</div>

A front-panel module can usually be replaced on its own. When optics shares a package with an expensive processor, a faulty component may require more extensive repair. The design also has to account for the processor's heat and the precise alignment needed to get light into and out of the fibers.

Two measurements help compare the options:

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

Energy per bit must include the whole link: generating light, putting data onto it, detecting it, processing the signal, and controlling temperature. Light lost at connections can require more laser power.

**For each distance and connection layout, the practical question is which link should become optical first, not when everything becomes optical.**

---

## How an optical link works

An optical link follows this path:

~~~text
electrical data
    -> put data onto light (modulation)
    -> carry the light through a waveguide or fiber
    -> detect the light and recover the signal
    -> electrical data
~~~

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/photonics_as_solution.png' | relative_url }}"
    alt="Diagram showing electrical-to-optical conversion, optical transmission through fiber, and optical-to-electrical conversion"
  />
  <p>The accelerator remains electronic. Photonics changes the communication path between endpoints.</p>
</div>

A laser supplies the light, and a modulator changes it according to the electrical data. A detector at the receiving end converts the arriving light into an electrical signal.

One common design, a Mach-Zehnder modulator, splits light into two paths and recombines them. A voltage changes how light travels through one or both paths, shifting the relative timing of the waves, called their phase. When the waves meet again, they reinforce or cancel each other to different degrees. The resulting change in brightness carries the signal.

Silicon can guide light and is compatible with established chip manufacturing, but it is inefficient at emitting light. A practical system may bond a light-emitting material, such as indium phosphide, onto the silicon device, or supply light from a separate laser.

### Wavelength is an extra axis

Light can carry separate data streams at different wavelengths. Think of them as different colors, although the wavelengths used here are typically infrared and invisible to us. **Wavelength-division multiplexing (WDM)** combines those streams onto one waveguide or fiber. A multiplexer, or mux, combines the wavelengths; a demultiplexer, or demux, separates them at the other end.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/wdm_vs_electrical.svg' | relative_url }}"
    alt="Comparison of parallel electrical lanes with several wavelength channels sharing one optical waveguide"
  />
  <p>Electrical links often scale through faster signaling, more lanes, or both. WDM adds independently modulated wavelengths to one physical optical path.</p>
</div>

Electrical links also carry more information through multiple voltage levels or frequency channels. WDM adds optical channels without needing a separate fiber or waveguide for each one.

**Optical mux and demux components can also be passive: they can combine and separate wavelengths without active switching power.** Their shapes and materials do the separating, but some light is lost along the way. This is called insertion loss, and compensating for it can require more laser power. Temperature changes can also shift which wavelengths a filter passes, so some designs need heating or tuning to stay aligned.

Those channels share a path, but the hardware that combines and separates them still needs space.

---

## Photonics has a density problem too

In integrated photonics, the mux and demux are physical structures on a chip. Other components split light between paths, filter wavelengths, or guide it around bends. Together, they take up area.

Many photonic components are much larger than electronic transistors. Their dimensions depend on the wavelength of light, how tightly the material can confine it, and how far it needs to travel for the device to work. Shrinking a device means finding a shape that can still control the light in less space.

The package has limited space for these components and for the connections that carry signals out. Smaller muxes, demuxes, and splitters can leave room for more optical channels or other functions.

Fiber connections, electronics, optical losses, and heat can still limit bandwidth. But when device area is a constraint, a smaller design helps. Inverse design gives us a way to search for those smaller shapes.

---

## What inverse design actually does

Conventional device design often starts with a familiar shape, such as a branching waveguide that splits light between two outputs. An engineer simulates it, changes a few dimensions, and repeats.

With inverse design, we specify the behavior we want and let an algorithm search for a shape. For example, we might ask it to send one wavelength to the upper output and another to the lower output, losing as little light as possible and keeping it out of the wrong port. A simulation predicts how light travels through each proposed shape.

The algorithm uses a gradient to decide which small changes should improve the result. The adjoint method can calculate these gradients across thousands of adjustable regions using a small number of simulations, rather than testing each region separately. It then adjusts the shape and repeats. The [SPINS inverse-design framework paper](https://arxiv.org/abs/1910.04829) explains the method in more detail.

This search can produce compact devices that would be hard to draw by intuition alone. The next step is making them.

---

## From simulated designs to fabricated devices

An optimized shape may contain tiny holes, narrow bridges, or isolated islands of material. Some features are hard to manufacture consistently; others change the optical response significantly if their dimensions shift even slightly.

The steps that print and etch a pattern onto a chip cannot reproduce every boundary perfectly. Manufacturing constraints can be included during optimization, but a design that works in simulation still needs to be fabricated and tested.

Finding the design takes time, too. Simulations are expensive, and different starting shapes can lead to different results. Even after a search succeeds, it may be difficult to tell which features are essential and which could be simplified.

Previous designs and experiments can help us choose better starting shapes, identify sensitive features, and test changes that make a device easier to manufacture.

---

## Where our work fits

Our work explores three connected ways to improve this design process:

### Learn: reuse prior optimization efforts

We train a generative model on previous designs so a new search can start from what earlier optimization runs have learned.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/generative_priors_pipeline.png' | relative_url }}"
    alt="Pipeline comparing uninformed initialization with cVAE learned priors followed by FDTD adjoint optimization"
  />
  <p>A generative model proposes starting shapes from previous designs. Simulations then refine their optical performance.</p>
</div>

### Understand: identify feature sensitivity

We test which parts of a design matter most by making devices with deliberate, localized edits in predicted sensitive regions and in a less sensitive region for comparison. The microscope images below show those controlled changes.

<div class="asset-figure wide dark">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/geometry_sensitivity_fabrication.png' | relative_url }}"
    alt="Electron microscope images of wavelength demultiplexers with deliberate local geometry changes in three predicted sensitive regions and a less sensitive control region"
  />
  <p>Sensitivity analysis identifies which deviations matter most for optical performance.</p>
</div>

### Refine: fabrication-friendly trimming

We use information from the optimization to rank edits that could simplify a layout. A new physics simulation checks that each accepted change preserves the required performance.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/solver_native_trimming_workflow.png' | relative_url }}"
    alt="Workflow for solver-native attribution and iterative geometry removal verified by forward electromagnetic simulations"
  />
  <p>Candidate regions are removed one at a time, with simulations checking whether the device still meets its performance target.</p>
</div>

These projects include one [APL Engineering Physics paper](https://pubs.aip.org/aip/aep/article/1/3/036106/3397071/Interpretable-geometry-sensitivity-for-inverse) and two papers accepted for [IEEE Photonics Conference 2026 oral presentations]({{ '/publications/' | relative_url }}). We want to connect these steps so that each design and experiment helps improve the next.

---

## Movement is part of the architecture

FlashAttention reduces the memory traffic needed for a calculation. Optical links carry the data that still has to move between processors. Both help keep computing hardware supplied with data.

Bringing optics closer to compute makes that connection shorter, but puts more pressure on device size, power, and manufacturing. Compact photonic devices are one part of making those links practical. Their value comes from how well they work in the complete system.

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
