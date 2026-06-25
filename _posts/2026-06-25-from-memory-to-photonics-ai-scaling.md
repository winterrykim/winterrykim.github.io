---
layout: post
title: "From Memory to Photonics: Solving the Next Bottleneck in AI Scaling"
date: 2026-06-25
description: "A future-me note on how FlashAttention is IO-aware, why AI scaling turns memory movement into communication movement, and why photonics matters for the next interconnect bottleneck."
tags: [ml, llm, systems, systems-infrastructure, hardware, photonics, from-scratch]
categories: [technical-blogs]
thumbnail: /assets/img/blog_img/photonics-scaling/photonics_layer.png
featured: true
_styles: |
  .aha-box {
    margin: 1.35rem 0;
    padding: 1rem 1.1rem;
    border-left: 4px solid #2f6f73;
    border-radius: 8px;
    background: rgba(47, 111, 115, 0.08);
  }

  .aha-box strong {
    color: #24575a;
  }

  .wait-box {
    margin: 1.15rem 0 1.3rem;
    padding: 0.85rem 1rem;
    border-left: 4px solid #c84242;
    border-radius: 8px;
    background: rgba(200, 66, 66, 0.08);
    color: #573033;
  }

  .wait-box strong {
    color: #9f2f2f;
  }

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

  .movement-map {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(215px, 1fr));
    gap: 0.8rem;
    margin: 1.2rem 0 1.6rem;
  }

  .movement-map div {
    padding: 0.9rem 1rem;
    border: 1px solid rgba(47, 111, 115, 0.16);
    border-radius: 8px;
    background: rgba(250, 252, 252, 0.86);
    color: #203f45;
  }

  .movement-map strong {
    display: block;
    margin-bottom: 0.25rem;
    color: #203f45;
  }

  html[data-theme="dark"] .aha-box {
    background: rgba(47, 111, 115, 0.22);
  }

  html[data-theme="dark"] .aha-box strong {
    color: #8cc6c9;
  }

  html[data-theme="dark"] .wait-box {
    background: rgba(200, 66, 66, 0.18);
    color: #f0c4c4;
  }

  html[data-theme="dark"] .wait-box strong {
    color: #ffaaaa;
  }

  html[data-theme="dark"] .asset-figure img {
    border-color: rgba(255, 255, 255, 0.14);
  }

  html[data-theme="dark"] .movement-map div {
    background: rgba(255, 255, 255, 0.035);
    border-color: rgba(255, 255, 255, 0.13);
    color: #d7e1e4;
  }

  html[data-theme="dark"] .movement-map strong {
    color: #e5f0f2;
  }
---

<p class="post-byline">w/ <a href="https://punhojark.github.io/">Junho Park</a> (Di Liang Lab, University of Michigan)</p>

In the [previous post]({% post_url 2026-06-23-training-lm-from-scratch-part2-flashattention-memory %}), I looked at FlashAttention as an example of IO-aware algorithm design.

The important lesson was not simply "FlashAttention is faster." The deeper lesson was that the same mathematical equation can behave very differently depending on how data moves through hardware.

Naive attention writes large intermediate tensors to HBM. FlashAttention avoids materializing those tensors, streams over tiles, keeps online softmax statistics, and recomputes what it needs later.

So FlashAttention is not fixing memory hardware.

It is adapting the algorithm to the memory hierarchy that already exists.

<div class="aha-box">
<strong>Main point:</strong> FlashAttention showed one way software can be IO-aware: align the computation with the memory hierarchy, and avoid moving data when we do not need to.
</div>

This post zooms out from memory movement inside one device to communication between many devices.

Once a model scales beyond one accelerator, we are no longer only asking how data moves between device memory, on-chip memory, registers, and matmul units. We are also asking how data moves across devices, servers, and racks.

That is where photonics starts to matter.

---

## The physical bottleneck is still there

FlashAttention is a good reminder that software can do a lot.

But it does not remove the underlying physical constraint. An accelerator still has registers, on-chip SRAM / scratchpad memory, caches, and HBM or other device memory. Data still has to move between them. That movement costs time and energy.

At this level, engineers worry about things like:

- HBM traffic
- on-chip SRAM / scratchpad / shared-memory usage
- register pressure
- cache behavior
- occupancy
- kernel scheduling
- whether a kernel is compute-bound or memory-bound

The raw matmul engines are extremely fast and heavily optimized. This does not mean matmul is never the bottleneck. If a kernel has high arithmetic intensity and enough data reuse, it can absolutely become compute-bound.

But as systems scale, the uncomfortable question often shifts from:

```text
Can we do the multiply?
```

to:

```text
Can we feed the multiply and coordinate all the devices?
```

This is why arithmetic intensity and roofline models are useful. A roofline picture forces us to ask how much useful math we get per byte moved, and whether runtime is limited by compute throughput, memory bandwidth, communication bandwidth, or capacity. The [JAX scaling book roofline chapter](https://jax-ml.github.io/scaling-book/roofline/) gives a nice version of this framing.

The short version is:

<div class="movement-map">
  <div>
    <strong>Compute</strong>
    How many operations can the accelerator do per second?
  </div>
  <div>
    <strong>Memory</strong>
    How quickly can the accelerator get local data from device memory and on-chip memory?
  </div>
  <div>
    <strong>Communication</strong>
    How quickly can devices exchange data with each other?
  </div>
</div>

FlashAttention mostly lives in the second box. It reduces unnecessary memory traffic inside the device.

Photonics mostly enters through the third box: communication.

---

## Now zoom out to hyperscale

Training and serving large models often involve many accelerators connected together: inside one server, across racks, and sometimes across whole data-center campuses.

At that scale, communication becomes part of the model runtime.

Some examples:

- tensor parallelism moves intermediate activations between devices
- data parallelism synchronizes gradients
- pipeline parallelism sends activations between stages
- MoE models create all-to-all routing patterns
- inference may shard weights or KV cache across devices

This is not just "networking" as a separate IT topic. For large models, communication can sit directly in the critical path of training or inference.

Inside one accelerator, the question was local memory traffic.

Across many accelerators, the question becomes communication.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/data_center_scale.png' | relative_url }}"
    alt="Hand-drawn diagram showing scale-up, scale-out, and scale-across directions for data-center infrastructure"
  />
  <p>Scale-up, scale-out, and scale-across are different versions of the same pressure: more compute nodes need more links.</p>
</div>

To visualize how big this can get, some proposed AI data-center campuses are being discussed at almost city-like scale. One reported example is the Stratos project in Utah, which has been described as a 40,000-acre campus, roughly 162 km<sup>2</sup> (<a href="https://www.theverge.com/ai-artificial-intelligence/933687/utah-stratos-project-data-center-kevin-oleary">The Verge</a>). ICML 2026 is taking place in Seoul (<a href="https://icml.cc/Conferences/2026">ICML 2026</a>), and Seoul proper is about 605 km<sup>2</sup> (<a href="https://en.wikipedia.org/wiki/Seoul">Seoul</a>).

That is roughly one quarter of Seoul.

<div class="asset-figure">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/ICML_image.jpg' | relative_url }}"
    alt="Seoul skyline used as a scale reference for ICML 2026"
  />
  <p>Seoul compared with the reported Stratos footprint.</p>
</div>

I do not want to make too much out of one proposed project. Not every AI data center will look like this, and reported plans can change.

But even this rough scale makes the point: as AI systems get physically larger, moving data between machines becomes harder to ignore.

---

## Copper is useful, but the tradeoff gets painful

Many short electrical links are copper-based. Copper is not bad.

Copper is useful for a reason: short distance, low cost, mature manufacturing, familiar packaging, and practical deployment.

The problem is that high-bandwidth, longer-distance communication becomes increasingly expensive in power and heat.

As bandwidth and distance increase, copper runs into a bandwidth-distance-power tradeoff. High-speed copper links often need stronger signaling, equalization, retimers, and more power to preserve signal integrity. More power becomes more heat. More heat becomes a cooling and reliability problem.

This does not mean copper disappears. It means copper becomes less attractive when bandwidth, distance, density, and energy efficiency all have to improve at the same time.

<div class="asset-figure">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/fiber_copper_loss.jpg' | relative_url }}"
    alt="Comparison plot showing lower signal loss for fiber than copper over distance"
  />
  <p>A simple fiber/copper loss comparison over distance (<a href="https://www.fastcabling.com/2021/09/09/extend-wifi-with-wifi-6-access-point-using-fiber-optic-cable/">source</a>).</p>
</div>

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/interconnect_length.png' | relative_url }}"
    alt="Hand-drawn diagram of interconnect lengths from package scale to board scale to rack scale"
  />
  <p>Interconnect distances from OIF's <em>Next Generation CEI-224G Framework</em>, Table 4 (<a href="https://www.oiforum.com/wp-content/uploads/OIF-FD-CEI-224G-01.0.pdf">source</a>).</p>
</div>

This is also why I am careful when I see simple market stories like "AI means buy copper" or "AI means buy natural resources."

That story can be economically relevant. Data centers do use a lot of physical material. Copper demand can matter.

But from a hardware-systems perspective, copper is also one of the places where scaling pressure shows up. If the system needs more bandwidth over longer distances with lower energy per bit, optics becomes more attractive.

The point is not "copper is wrong."

The point is:

```text
short, cheap, electrical links: copper is very good
longer, denser, higher-bandwidth links: optics becomes more important
```

There is also a subtle latency point here.

Optics is not interesting just because "light is fast." Electrical signals in copper also propagate at a significant fraction of the speed of light. For many AI interconnect discussions, the bigger practical wins are bandwidth density, reach, signal integrity, and energy per bit.

That is the less catchy version of the story, but it is the one I find more useful.

---

## Heat is not only a chip problem

Heat is easy to think of as a chip-level problem:

```text
accelerator gets hot
rack needs cooling
data center needs power
```

But at AI infrastructure scale, heat becomes environmental too.

Data centers convert huge amounts of electrical power into waste heat, and that heat has to go somewhere. We now see headlines like ["Data centers raise temperatures up to 4 degrees in nearby neighborhoods: study"](https://www.facilitiesdive.com/news/data-centers-raise-temperatures-4-degrees-ASU-Sailor-thermal-plume/821164/).

The Facilities Dive article discusses a Phoenix-area study where air-cooled data centers were associated with downwind temperature increases in nearby neighborhoods. I do not read that as "copper wires are heating neighborhoods." That would be the wrong causal story.

The point is broader:

<div class="wait-box">
<strong>Careful:</strong> I am not saying copper wires heat neighborhoods by themselves. The broader point is that compute, networking, cooling, and power delivery all sit inside the same physical system.
</div>

This is why I keep coming back to movement.

Not just:

```text
How many FLOPs can we buy?
```

but:

```text
How much data has to move?
How far does it move?
How much energy is spent per bit?
Where does the heat go?
```

This is the connection between FlashAttention and photonics: FlashAttention asks us to stop moving unnecessary intermediate tensors through HBM, while photonics asks whether the physical interconnect itself should change when the system gets large enough.

---

## Photonics: yes, light, not electricity

This is where photonics enters.

Instead of sending information only as electrical signals through copper, optical communication sends information as light through fiber or optical waveguides.

The basic path is:

```text
electrical signal -> optical signal -> fiber/waveguide -> electrical signal
```

The conversion happens through optical transceivers or optical engines.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/photonics_as_solution.png' | relative_url }}"
    alt="Hand-drawn diagram showing electrical-to-optical conversion, optical transmission through fiber, and optical-to-electrical conversion"
  />
  <p>Electrical signal to optical link and back.</p>
</div>

There are two important pieces:

1. **Optical transceiver / optical engine**: converts electrical signals to optical signals and back.
2. **Optical fiber / waveguide**: carries the optical signal.

Companies like Lumentum, Coherent, Broadcom, Marvell, and others participate in the transceiver / optical-engine ecosystem. Corning is one major company associated with optical fiber.

<div class="asset-figure dark">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/coherent_optical_transceiver.png' | relative_url }}"
    alt="Annotated optical transceiver and co-packaged optics diagram showing integrated circuits, detectors, lasers, passive optics, and a switch or accelerator package"
  />
  <p>Optical transceiver and co-packaged optics view, from Coherent's March 17, 2026 briefing (<a href="https://cdn.prod.website-files.com/67b66b7d2a3d3a0f9c895fbd/67debb9322330cf373d1c5d2_Technology%20Innovation%20Briefing%20-%20Final.pdf">PDF</a>).</p>
</div>

This is also where the story becomes more interesting than just "replace copper cables with fiber."

Data centers already use optical fiber heavily, especially for longer reaches. The newer pressure is about moving optics closer to compute: from pluggable modules, to optical engines near switch ASICs, to co-packaged optics, and maybe eventually to optical I/O closer to accelerator packages.

That does not mean all links become optical overnight.

It means the electrical-to-optical boundary may move closer to the chips as bandwidth and energy pressure increase.

<div class="wait-box">
<strong>Careful:</strong> photonics does not mean zero heat. Lasers, modulators, photodetectors, drivers, DSPs, packaging, and cooling still consume power. The point is that optical links can offer better reach, bandwidth density, signal integrity, and energy-per-bit in regimes where copper becomes painful.
</div>

Also, this post is about optical communication, not replacing matmul units with optical computing.

That distinction matters.

The accelerator still does the matrix multiplication, whether that accelerator is a GPU, TPU, or something else. Photonics is mostly about moving data between compute elements more efficiently.

---

## Which layer does photonics actually change?

This was the part that confused me at first.

When people say photonics matters for AI, it can sound like photonics is replacing the accelerator. That is not the main story here.

Photonics does not directly replace HBM, on-chip memory, registers, or matmul units.

It mostly changes the interconnect layer.

<div class="asset-figure wide">
  <img
    src="{{ '/assets/img/blog_img/photonics-scaling/photonics_layer.png' | relative_url }}"
    alt="Hand-drawn hierarchy showing FlashAttention inside an accelerator memory hierarchy and photonics between accelerators, servers, racks, and data centers"
  />
  <p>Where FlashAttention and photonics sit in the system stack, using OIF CEI-224G interconnect layers (<a href="https://www.oiforum.com/wp-content/uploads/OIF-FD-CEI-224G-01.0.pdf">source</a>).</p>
</div>

The useful distinction is scale.

Inside one accelerator, FlashAttention is about the local memory hierarchy: device memory, on-chip memory, caches, registers, and the matmul units doing the work.

Between devices, servers, and racks, the relevant objects change. Now we are talking about NVLink-like links, Ethernet or InfiniBand fabrics, switches, cables, and transceivers. This is the layer where photonics increasingly matters.

Across data centers, fiber is already the normal story, although longer reach brings its own loss, dispersion, and networking constraints.

So the short comparison is simple: FlashAttention is IO-aware software inside the device. Photonics is communication-aware infrastructure between devices and systems.

This distinction also keeps us honest.

Photonics is not the answer to every link at every scale. Very short links can still be better served electrically because the conversion overhead, packaging cost, thermal constraints, and integration complexity may not be worth it.

The interesting part is the boundary.

Where should the system stop being electrical and become optical?

That boundary is moving.

---

## Why this matters for AI scaling

As AI models and clusters scale, the system becomes less like one big computer doing math and more like many devices passing tensors back and forth.

The matmul units may be ready to multiply. But the system still has to deliver the right tensors to the right device at the right time.

That makes communication a first-class bottleneck.

We can attack this from the software side:

- better sharding
- better scheduling
- communication overlap
- kernel fusion
- topology-aware parallelism
- IO-aware algorithms like FlashAttention

But as clusters grow, the physical interconnect itself starts to matter.

This is why photonics matters: AI scaling keeps turning compute problems into movement problems.

```text
memory movement
network movement
heat movement
energy movement
```

So the hardware story is not only faster compute. It is also less-wasteful movement.

---

## Where our work fits

If photonics becomes a more important part of AI infrastructure, then designing photonic components becomes more important too.

But photonic design is not always intuitive.

The design space can be high-dimensional, physics-constrained, and hard to interpret. A small geometric change can alter interference, coupling, loss, bandwidth, fabrication robustness, or wavelength response. It is not always obvious from the final shape why a design works.

This is why inverse design is useful in silicon photonics. Many of the building blocks we care about, such as splitters, couplers, mode converters, and filters, need to be compact and efficient while still respecting fabrication and physics constraints.

This is the part closer to our own work.

We are interested in methods that do not only generate designs, but also help us understand why those designs work.

In other words:

```text
design capability + interpretability
```

That combination matters because photonics is not just another black-box optimization problem. If photonic devices are going to sit closer to AI infrastructure, we need tools that respect both the physics and the engineering constraints.

If this direction is interesting, come see our poster at ICML AI4Physics.

---

## References

- [Training a Language Model from Scratch (Part 2: FlashAttention and Device Memory)]({% post_url 2026-06-23-training-lm-from-scratch-part2-flashattention-memory %})
- [JAX Scaling Book: Roofline](https://jax-ml.github.io/scaling-book/roofline/)
- [ICML 2026 official conference page](https://icml.cc/Conferences/2026)
- [Seoul: city area](https://en.wikipedia.org/wiki/Seoul)
- [The Verge: The biggest data center ever is becoming a huge problem in Utah](https://www.theverge.com/ai-artificial-intelligence/933687/utah-stratos-project-data-center-kevin-oleary)
- [Facilities Dive: Data centers raise temperatures up to 4 degrees in nearby neighborhoods: study](https://www.facilitiesdive.com/news/data-centers-raise-temperatures-4-degrees-ASU-Sailor-thermal-plume/821164/)
- [OIF: Next Generation CEI-224G Framework](https://www.oiforum.com/wp-content/uploads/OIF-FD-CEI-224G-01.0.pdf)
- [Coherent: Technology Innovation Briefing, March 17, 2026](https://cdn.prod.website-files.com/67b66b7d2a3d3a0f9c895fbd/67debb9322330cf373d1c5d2_Technology%20Innovation%20Briefing%20-%20Final.pdf)
- [FastCabling: Extend WiFi with WiFi 6 access point using fiber optic cable](https://www.fastcabling.com/2021/09/09/extend-wifi-with-wifi-6-access-point-using-fiber-optic-cable/)
