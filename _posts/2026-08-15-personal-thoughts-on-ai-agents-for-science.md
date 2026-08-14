---
layout: post
title: "Personal Thoughts on AI Agents for Science"
date: 2026-08-15
description: "Thoughts from applying AI agents to drug discovery: verifiable problems, incomplete scientific labels, statistical evaluation, and experimental feedback."
tags: [ml, ai-for-science, agents-workflows, statistics-inference, drug-discovery]
categories: [technical-blogs]
featured: false
math: true
_styles: |
  .asset-figure {
    margin: 1.5rem 0 1.7rem;
    text-align: center;
  }

  .asset-figure img {
    width: 100%;
    max-width: 1100px;
    height: auto;
    border: 1px solid var(--global-divider-color);
    border-radius: 8px;
    background: #fff;
  }

  .asset-figure p {
    margin: 0.55rem auto 0;
    max-width: 900px;
    color: var(--global-text-color-light);
    font-size: 0.9rem;
  }
---

There is currently a lot of hype around AI agents. My initial impression was that many agent systems looked more like software-engineering exercises: orchestrate several language models, give them different roles and tools, and try to make the combined system produce something useful.

I did not want to settle on that impression without testing some of these ideas myself. I tried applying agents in two scientific domains: drug discovery and photonics.

For biology, I focused on finding **drug-binding sites**. Many models can design a binder once a target site on a protein is specified. Fewer tools address the bottleneck immediately before binder design: *where on the protein should we target in the first place?*

I wondered whether this upstream step could be automated while also recording why a particular region was selected. In simplified computer science terms, the task looks like finding a useful substring inside a long string of amino acids. In reality, the choice also depends on biological constraints such as topology, accessibility, post-translational modifications, and structural context. This became [Site4Drug](https://arxiv.org/abs/2606.01816), an agentic pipeline for proposing and evaluating targetable protein regions.

The thoughts below are not conclusions I consider final. I may be wrong, but I want to record them so I can return later and trace how my thinking changes.

---

## Agents seem promising when the problem is verifiable, but what if it is not?

There is a common idea in current AI research: if an answer is verifiable, a model may eventually solve the problem no matter how difficult it is to generate that answer. I think there is something important in this idea. With a reliable verifier, an agent can try an answer, check the result, and use the feedback to improve its next attempt. Code is a natural example because tests can provide relatively cheap and repeatable feedback.

Many scientific questions do not offer such clean feedback.

Suppose a database contains an experimentally discovered binding site for a protein. That site is a known positive. But this does not mean every other region on the protein is useless. Some regions may have failed experimentally, while others may simply never have been tested.

An undiscovered site is not necessarily a negative site.

<div class="asset-figure">
  <img
    src="{{ '/assets/img/blog_img/ai-agents-science/binding_site.png' | relative_url }}"
    alt="A protein sequence with one experimentally observed binding site and two untested regions that are not known negatives"
  />
  <p>An observed binding site is positive evidence, not proof that every other region is invalid.</p>
</div>

This creates a problem for model improvement and post-training. If we reward the model for selecting the known site and penalize every other answer, we may teach it to reproduce what happened to be discovered rather than the underlying biology. More data does not automatically solve the problem if the data contains the same blind spots.

> **How should we upweight one choice over another when we cannot guarantee that the unobserved choices are wrong?**

This was one of the core questions I kept returning to. In our project, adding more agent orchestration was not what most improved the results. The important improvements came from the traditional bioinformatics pipeline and the biological constraints supplied to the model. The agent was most useful when it integrated those signals into a structured process.

That experience changed my initial framing. The value of the agent did not come simply from combining more language models. It depended on the quality of the evidence and feedback available to the system.

This left two downstream problems. How should we evaluate predictions against incomplete labels? And even if we can obtain more labels through experiments, how should an agent learn when that feedback remains limited and noisy?

---

## Evaluation should reflect incomplete labels

Once we treated the recorded binding site as positive but incomplete evidence, the next question was how to evaluate a prediction. I discussed this repeatedly with my friend and co-author Jeongbin Park:

> Given that our data contains a discovered binding site, but not necessarily the only correct site, how should we evaluate the prediction?

Pure accuracy does not quite capture this setting because it treats the recorded label as the complete answer. Instead, we used a hypergeometric test. We did not try to claim that the model had produced *the* uniquely correct site. We asked whether its predicted residues overlapped the experimentally observed site more than we would expect from a random selection of the same size.

If a protein has $N$ residues, the known site contains $K$ residues, the model selects $n$ residues, and the overlap is $x$, then under a random-selection null model,

$$
X \sim \operatorname{Hypergeometric}(N,K,n).
$$

We can then ask how likely it would be for a random selection to produce an overlap as large as the one we observed. A small p-value means that this degree of overlap would be unlikely under the random-selection null model.

The distinction from accuracy is subtle but important. We are testing whether the model can reliably “hit” a known region beyond chance. We are not declaring every other prediction incorrect.

This reminded me of ideas from statistics. Statisticians have long considered what happens when we test many hypotheses and repeatedly give ourselves opportunities to find something significant. Methods such as Bonferroni correction and the Benjamini-Hochberg procedure provide different ways to limit false discoveries.

Could statistical evidence against a null hypothesis become part of the reward, rather than rewarding only exact agreement with a label? I do not yet know. A p-value is not biological ground truth, and a poorly designed reward could simply create a new target for the agent to game.

Still, I suspect scientific-agent evaluation will need more of this kind of thinking instead of reducing every problem to a single accuracy or reward number. Statistical testing cannot create the experimental labels that are missing, but it can make us more precise about what the available evidence does and does not show.

---

## In science, the final verifier is often an experiment

To move beyond the evidence already available, science eventually needs new evidence from the physical world. A model or database can support a hypothesis, but an experiment tells us whether a proposed binder actually binds under the conditions we care about. Physical validation then introduces two separate problems: how quickly we can obtain feedback and how an agent should learn from it.

If an agent can generate a thousand hypotheses in an hour but each experiment takes several months, the main bottleneck is no longer generation. It is obtaining trustworthy feedback from the world.

The same gap appears in photonics and hardware design. Agents may help propose or optimize a chip, but the design still has to be fabricated and measured. A successful simulation is not the same thing as a successful device.

This is the hardware bottleneck. It has led me to a more speculative thought: the next major advances in AI for science may be led by experimental hardware rather than software. Better data collection, lab automation, higher-throughput experiments, and tighter feedback loops between computational proposals and physical measurements may ultimately matter more than adding another language model to the orchestration layer. It is one reason I have started paying much more attention to hardware than before.

But faster validation does not automatically produce clean labels. Even if physical validation becomes available at a reasonable speed, wet-lab measurements remain noisy. If a result fails, we may not immediately know whether the problem came from the computational model, protein synthesis, sample preparation, chip fabrication, experimental execution, or the measurement itself.

This is a separate training problem. An agent has to learn from a limited number of outcomes without treating every result as a clean label. It also has to account for uncertainty about which part of the pipeline should be questioned when something fails. Hardware determines how quickly we can obtain feedback. Training determines how well we use each uncertain piece of feedback.

---

## Conclusion

My current thinking follows one chain:

1. **Unobserved choices are not necessarily wrong.** A known positive is evidence for one choice, not proof that every alternative is invalid.
2. **Limited evidence still has to support evaluation and learning.** Statistics can help us ask whether a model recovers known evidence beyond chance without pretending that the observed labels are complete.
3. **New evidence requires physical validation.** The speed and scale of that validation create a hardware bottleneck.
4. **Experimental feedback is not a clean label.** A training method must account for real-world noise and uncertainty about where a failure occurred.

The main question I am left with is:

> **How should we upweight one choice over another when we cannot guarantee that the unobserved choices are wrong?**

Answering this requires two things at the training layer. First, the agent must learn efficiently from limited evidence. Second, it must account for real-world noise and uncertainty about where to assign credit or blame when an experiment succeeds or fails. A useful training loop should neither treat every failed experiment as a clean negative nor overlearn from a few uncertain results. Methods from Bayesian optimization and experimental design already study how to learn from expensive and noisy observations. I do not yet know how those lessons should translate into modern agent training, but this seems like an important bridge between fast computational iteration and physical validation.

For me, this is where the interesting problem begins. The challenge is not only how to orchestrate models, but how to connect them to evidence from a world that is slow, noisy, and incomplete.
