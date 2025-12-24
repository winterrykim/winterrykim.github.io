---
layout: post
title: "Transformer and LLM Efficiency"
date: 2025-12-22 18:00:00 -0800
description: "Summary Notes on Catching Up"
tags: [ml, notes]
categories: [technical-blogs]
featured: true
---

This post summarizes the major developments for efficiency / background knowledge.
### Optimization Layers 

- **Architecture:** MQA, GQA, MoE, Sparse
- **System / Kernel:** FlashAttention (IO), PagedAttention (KV cache)
- **Modeling:** RoPE

---

### Architecture

Vanilla Transformer has MHA (Multi-Head Attention). The improvements are mainly made by adjusting the dimension of heads.

#### MQA (Multi-Query Attention) [2019, Noam Shazeer]

> "However, when generating from the trained model, the output of the self-attention layer at a particular position affects the token that is generated at the next position, which in turn affects the input to that layer at the next position. This prevents parallel computation."

But we can still make incremental steps cheaper.

MHA (Multi-Head Attention) → MQA (Multi-Query Attention), GQA (Grouped Query Attention)

<div style="text-align:center; margin: 1rem 0;">
  <img
    src="{{ '/assets/img/blog_img/llm_eff/MQA_diagram.png' | relative_url }}"
    alt="Multi-Query Attention (MQA) diagram"
    style="max-width: 900px; width: 100%; height: auto;"
  />
</div>

*Figure: Multi-Query Attention (MQA) overview.*


#### GQA (Grouped Query Attention) [2023, J Ainslie et. al]


<div style="text-align:center; margin: 1rem 0;">
  <img
    src="{{ '/assets/img/blog_img/llm_eff/GQA_diagram.png' | relative_url }}"
    alt="Group-Query Attention (GQA) diagram"
    style="max-width: 900px; width: 100%; height: auto;"
  />
</div>


> "However, multi-query attention (MQA) can lead to quality degradation and training instability, and it may not be feasible to train separate models optimized for quality and inference."

1. Uptrain: 
MHA -> GQA: You can pool and combine the initial ones without having to train from scratch.

2. GQA: Simply the middle ground between MHA and MQA. Which is why it mentions based on the count it just becomes MHA or MQA.
  
> "Grouped-query attention divides query heads into G groups, each of which shares a single key head and value head. GQA-G refers to grouped-query with G groups. 
> "GQA-1, with a single group and therefore single key and value head, is equivalent to MQA, while GQA-H, with groups equal to number of heads, is equivalent to MHA."

#### MoE 

Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer [2017, N Shazeer]

Switch Transformers [2021, W Fedus]

Sparse Upcycling (The one mentioned in GQA Paper as well) [2022, A Komatsuzaki]


