---
layout: post
title: "Training a Language Model from Scratch (Part 1: Building Blocks)"
date: 2026-05-06
description: "A future-me refresher on the main pieces behind a small Transformer language model: byte-level BPE, embeddings, RoPE, attention, normalization, loss, optimization, and decoding."
tags: [ml, llm, transformers, notes, from-scratch, modeling-generative]
categories: [technical-blogs]
featured: true
math: true
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

  .cs336-map {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.8rem;
    margin: 1.25rem 0 1.75rem;
  }

  .cs336-map div {
    padding: 0.9rem 1rem;
    border: 1px solid rgba(47, 111, 115, 0.18);
    border-radius: 8px;
    background: rgba(250, 252, 252, 0.86);
    color: #203f45;
  }

  .cs336-map div strong {
    color: #203f45;
  }

  details.refresher {
    margin: 1.25rem 0;
    padding: 1rem 1.1rem;
    border: 1px solid rgba(55, 82, 95, 0.16);
    border-radius: 8px;
    background: rgba(246, 249, 250, 0.9);
    color: #203f45;
  }

  details.refresher summary {
    cursor: pointer;
    font-weight: 650;
    color: #284b55;
  }

  .asset-figure {
    margin: 1.4rem 0;
    text-align: center;
  }

  .asset-figure img {
    max-width: 900px;
    width: 92%;
    height: auto;
    border: 1px solid rgba(33, 53, 64, 0.12);
    border-radius: 8px;
    background: #fff;
  }

  .asset-figure p {
    margin-top: 0.5rem;
    color: #66757f;
    font-size: 0.92rem;
  }

  table.token-table {
    width: 100%;
    margin: 1.1rem 0;
    border-collapse: collapse;
    color: #203f45;
    font-size: 0.95rem;
  }

  table.token-table th,
  table.token-table td {
    padding: 0.65rem 0.75rem;
    border: 1px solid rgba(55, 82, 95, 0.18);
    vertical-align: top;
  }

  table.token-table th {
    background: rgba(47, 111, 115, 0.09);
    color: #284b55;
  }

  .visual-block {
    margin: 1.45rem 0 1.85rem;
    padding: 1rem;
    border: 1px solid rgba(47, 111, 115, 0.18);
    border-radius: 8px;
    background: linear-gradient(180deg, rgba(250, 253, 253, 0.96), rgba(244, 249, 249, 0.92));
    color: #203f45;
  }

  .visual-title {
    margin-bottom: 0.8rem;
    color: #284b55;
    font-weight: 700;
  }

  .visual-flow {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    align-items: stretch;
  }

  .flow-node {
    flex: 1 1 128px;
    min-width: 128px;
    padding: 0.75rem 0.8rem;
    border: 1px solid rgba(47, 111, 115, 0.2);
    border-top: 3px solid #2f6f73;
    border-radius: 8px;
    background: #fff;
    color: #203f45;
  }

  .flow-node strong {
    display: block;
    color: #203f45;
  }

  .flow-node small {
    display: block;
    margin-top: 0.3rem;
    color: #687981;
    font-family: "SFMono-Regular", Consolas, monospace;
    font-size: 0.78rem;
    line-height: 1.35;
  }

  .flow-arrow {
    align-self: center;
    color: #2f6f73;
    font-weight: 800;
  }

  .compact-loop {
    padding: 0.85rem 0.9rem;
  }

  .compact-loop .visual-title {
    margin-bottom: 0.65rem;
    font-size: 0.92rem;
  }

  .compact-loop .visual-flow {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
    gap: 0.45rem;
  }

  .compact-loop .flow-node {
    min-width: 0;
    padding: 0.55rem 0.6rem;
    border-top: 0;
    border-left: 3px solid #2f6f73;
    border-radius: 7px;
  }

  .compact-loop .flow-node strong {
    font-size: 0.88rem;
  }

  .compact-loop .flow-node small {
    margin-top: 0.22rem;
    font-size: 0.68rem;
    line-height: 1.25;
  }

  .compact-loop .flow-arrow {
    display: none;
  }

  .two-column-visual {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 0.8rem;
  }

  .mini-panel {
    padding: 0.85rem;
    border: 1px solid rgba(47, 111, 115, 0.18);
    border-radius: 8px;
    background: #fff;
    color: #203f45;
  }

  .mini-panel h4 {
    margin: 0 0 0.55rem;
    color: #284b55;
    font-size: 1rem;
  }

  .token-line,
  .shape-line {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    align-items: center;
    margin: 0.5rem 0;
  }

  .token-chip,
  .shape-chip {
    display: inline-flex;
    align-items: center;
    min-height: 2.1rem;
    padding: 0.35rem 0.55rem;
    border: 1px solid rgba(47, 111, 115, 0.2);
    border-radius: 7px;
    background: rgba(47, 111, 115, 0.07);
    color: #203f45;
    font-family: "SFMono-Regular", Consolas, monospace;
    font-size: 0.84rem;
  }

  .matrix-visual {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 0.8rem;
    align-items: stretch;
  }

  .matrix-card {
    padding: 0.85rem;
    border: 1px solid rgba(47, 111, 115, 0.2);
    border-radius: 8px;
    background: #fff;
    color: #203f45;
  }

  .matrix-card strong {
    display: block;
    color: #203f45;
  }

  .matrix-card code {
    display: inline-block;
    margin-top: 0.35rem;
  }

  .residual-visual {
    display: grid;
    gap: 0.7rem;
  }

  .residual-row {
    display: grid;
    grid-template-columns: minmax(96px, 0.8fr) auto minmax(160px, 1.35fr) auto minmax(96px, 0.8fr);
    gap: 0.5rem;
    align-items: center;
  }

  .residual-cell {
    padding: 0.65rem 0.7rem;
    border: 1px solid rgba(47, 111, 115, 0.2);
    border-radius: 8px;
    background: #fff;
    color: #203f45;
    text-align: center;
    font-family: "SFMono-Regular", Consolas, monospace;
    font-size: 0.86rem;
  }

  .residual-op {
    color: #2f6f73;
    font-weight: 800;
    text-align: center;
  }

  .rope-pair-visual {
    display: grid;
    grid-template-columns: minmax(140px, 0.9fr) minmax(220px, 1.4fr) minmax(140px, 0.9fr);
    gap: 0.8rem;
    align-items: center;
  }

  .rope-vector,
  .rope-result {
    display: grid;
    gap: 0.45rem;
  }

  .rope-box {
    padding: 0.55rem 0.65rem;
    border: 1px solid rgba(47, 111, 115, 0.22);
    border-radius: 7px;
    background: #fff;
    color: #203f45;
    font-family: "SFMono-Regular", Consolas, monospace;
    font-size: 0.84rem;
  }

  .rope-formula {
    padding: 0.75rem;
    border-radius: 8px;
    background: rgba(47, 111, 115, 0.08);
    color: #203f45;
    font-family: "SFMono-Regular", Consolas, monospace;
    font-size: 0.84rem;
    line-height: 1.55;
  }

  .mini-caption {
    margin-top: 0.65rem;
    color: #66757f;
    font-size: 0.9rem;
  }

  .embedding-matrix {
    display: grid;
    grid-template-columns: minmax(210px, 0.9fr) minmax(260px, 1.2fr) minmax(210px, 0.9fr);
    gap: 0.8rem;
    align-items: center;
  }

  .embedding-mini-table {
    display: grid;
    gap: 0.28rem;
    margin-top: 0.55rem;
  }

  .embedding-row {
    display: grid;
    grid-template-columns: 4.2rem repeat(4, minmax(0, 1fr));
    gap: 0.25rem;
    align-items: center;
  }

  .embedding-row span {
    color: #657780;
    font-family: "SFMono-Regular", Consolas, monospace;
    font-size: 0.68rem;
  }

  .embedding-cell {
    min-height: 0.78rem;
    border-radius: 999px;
    background: rgba(47, 111, 115, 0.13);
  }

  .embedding-row.highlight-row span {
    color: #203f45;
    font-weight: 700;
  }

  .embedding-row.highlight-row .embedding-cell {
    background: rgba(47, 111, 115, 0.42);
  }

  .aha-box,
  .aha-box p,
  .aha-box li,
  .aha-box code,
  .cs336-map div,
  .cs336-map div *,
  details.refresher,
  details.refresher p,
  details.refresher li,
  details.refresher table:not(.rouge-table),
  details.refresher table:not(.rouge-table) *,
  details.refresher code,
  .visual-block,
  .visual-block p,
  .visual-block li,
  .visual-block code,
  .flow-node,
  .flow-node *,
  .mini-panel,
  .mini-panel *,
  .matrix-card,
  .matrix-card *,
  .residual-cell,
  .rope-box,
  .rope-formula,
  table.token-table,
  table.token-table * {
    color: #203f45 !important;
  }

  .aha-box mjx-container,
  details.refresher mjx-container,
  .visual-block mjx-container {
    color: #203f45 !important;
  }

  .visual-block .mini-caption,
  .matrix-card .mini-caption,
  .flow-node small,
  .embedding-row span {
    color: #4f646c !important;
  }

  details.refresher table:not(.rouge-table),
  .post table:not(.rouge-table) {
    background: #fff;
  }

  @media (max-width: 720px) {
    .aha-box,
    details.refresher,
    .visual-block {
      padding: 0.8rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .asset-figure img {
      max-width: 100%;
      width: 100%;
    }

    .asset-figure p,
    .mini-caption {
      font-size: 0.84rem;
    }

    table {
      display: block;
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      font-size: 0.86rem;
    }

    table th,
    table td {
      padding: 0.55rem 0.6rem;
    }

    table code {
      white-space: nowrap;
    }

    pre,
    .highlight,
    mjx-container[display="true"] {
      max-width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
    }

    .flow-arrow {
      display: none;
    }

    .cs336-map,
    .two-column-visual,
    .matrix-visual,
    .residual-row,
    .rope-pair-visual,
    .embedding-matrix {
      grid-template-columns: 1fr;
    }

    .flow-node,
    .mini-panel,
    .matrix-card,
    .residual-cell,
    .rope-box,
    .token-chip,
    .shape-chip {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .token-line,
    .shape-line {
      align-items: flex-start;
    }

    .rope-formula {
      overflow-x: auto;
      font-size: 0.76rem;
    }

    .embedding-row {
      grid-template-columns: 3.4rem repeat(4, minmax(0, 1fr));
    }

    .embedding-row span {
      font-size: 0.62rem;
    }

    .residual-op {
      display: none;
    }
  }
---

This is for future me when I need to review the building blocks of an LM.

While working through CS336 Assignment 1, I kept running into places where I thought I understood the concept, but the implementation details exposed a missing piece. RoPE was not just "add position somehow"; the tokenizer was not the same thing as the embedding layer; cross entropy was not just "take softmax and index the answer"; gradient clipping was not per-parameter clipping.

This post is a cleaned-up version of those notes and aha moments. It is not meant to be a full assignment solution dump. It is the map I want future me to have when I need to reload how the pieces connect: tokenizer, embeddings, RoPE, attention, normalization, feed-forward layers, loss, optimization, and decoding.

<div class="aha-box">
<strong>The one-line story:</strong> raw text becomes token IDs; token IDs become learned vectors; Transformer blocks mix previous-token information causally; the LM head turns every position into next-token logits; training pushes up the correct next token; decoding samples one new token from the last position and repeats.
</div>

<div class="visual-block compact-loop">
  <div class="visual-title">The whole loop, before the details</div>
  <div class="visual-flow">
    <div class="flow-node">
      <strong>Raw text</strong>
      <small>"the cat sat"</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>BPE tokenizer</strong>
      <small>text -> token IDs</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Embedding</strong>
      <small>[B,L] -> [B,L,D]</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Transformer</strong>
      <small>causal prefix mixing</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>LM head</strong>
      <small>[B,L,D] -> [B,L,V]</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Loss / sample</strong>
      <small>train or decode</small>
    </div>
  </div>
</div>

---

## Background refresher

Before the implementation details, I want to keep a small shelf of background notes I can come back to. Some of these are notes I created while course staff, and some are materials Sarah Pohland created during the semester. I like them because they connect the Transformer machinery back to a few intuitive ideas: similarity as an inner product, dimensions, attention masks, and training vs inference.

<details class="refresher" markdown="1">
<summary>Background notes and handouts</summary>

- [Main reference: Stanford CS336 Spring 2025](https://cs336.stanford.edu/spring2025/)
- [Discussion Mini Lecture 10: self-attention, inner products, and scaled dot-product attention]({{ '/assets/pdf/cs336-lm-from-scratch/discussion-mini-lecture-10.pdf' | relative_url }})
- [Discussion Walkthrough 10: Q/K/V and scaled dot-product examples]({{ '/assets/pdf/cs336-lm-from-scratch/discussion-walkthrough-10.pdf' | relative_url }})
- [Discussion Mini Lecture 11: Transformer flow, masking, inference, and KV cache]({{ '/assets/pdf/cs336-lm-from-scratch/discussion-mini-lecture-11.pdf' | relative_url }})
- [Discussion Walkthrough 11: positional encoding and RoPE derivation]({{ '/assets/pdf/cs336-lm-from-scratch/discussion-walkthrough-11.pdf' | relative_url }})
- [Disc08 Terry notes]({{ '/assets/pdf/cs336-lm-from-scratch/disc08-terry-notes.pdf' | relative_url }}) and [Dis09 Terry notes]({{ '/assets/pdf/cs336-lm-from-scratch/dis09-terry-notes.pdf' | relative_url }})
- [CS336 Assignment 1 handout]({{ '/assets/pdf/cs336-lm-from-scratch/cs336-assignment1-basics.pdf' | relative_url }})

</details>

<details class="refresher" markdown="1">
<summary>Attention refresher: what the notes are trying to make intuitive</summary>

The attention score is built from an inner product:

$$
z_{n,i} = q_n^\top k_i
$$

The query says what the current token is looking for. The key says what each candidate token exposes. A large dot product means the two vectors are pointing in a similar direction, so the current token should pay more attention to that earlier token.

In matrix form:

$$
Q = XW_Q,\quad K = XW_K,\quad V = XW_V
$$

$$
\text{Attention}(Q,K,V) = \text{softmax}_{\text{row}}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

The row-wise softmax turns each row of similarity scores into a distribution over which previous tokens to read from. The scale factor $\sqrt{d_k}$ keeps dot products from growing too large as the key/query dimension increases.

For language modeling, the causal mask blocks future positions. During training, we process the whole chunk at once, but position $i$ is only allowed to see positions $\leq i$, matching the information it would have during inference.

</details>

---

## The map of the building blocks

<div class="cs336-map">
  <div><strong>1. Tokenizer</strong><br/>raw text &lt;-&gt; token IDs</div>
  <div><strong>2. Embedding</strong><br/>token ID -&gt; learned vector row</div>
  <div><strong>3. Transformer block</strong><br/>RMSNorm, MHA + RoPE, SwiGLU</div>
  <div><strong>4. LM head</strong><br/>hidden row -&gt; vocab logits</div>
  <div><strong>5. Loss/training</strong><br/>cross entropy, AdamW, clipping, schedule</div>
  <div><strong>6. Decoding</strong><br/>last logits -&gt; next sampled token</div>
</div>

<div class="visual-block">
  <div class="visual-title">Keep the levels separate</div>
  <div class="matrix-visual">
    <div class="matrix-card">
      <strong>Tokenizer level</strong>
      <code>"the" -> 391</code>
      <p class="mini-caption">Names chunks of bytes/text with integer IDs.</p>
    </div>
    <div class="matrix-card">
      <strong>Embedding level</strong>
      <code>391 -> E[391, :]</code>
      <p class="mini-caption">Learns a vector row for each ID.</p>
    </div>
    <div class="matrix-card">
      <strong>Attention level</strong>
      <code>QK.T -> weights</code>
      <p class="mini-caption">Moves information across positions.</p>
    </div>
    <div class="matrix-card">
      <strong>Output level</strong>
      <code>h_i -> logits_i</code>
      <p class="mini-caption">Predicts the next token ID at each position.</p>
    </div>
  </div>
</div>

---

## I. Tokenizer: byte-level BPE

The tokenizer is not learning semantic vectors. It is deciding how raw text is split into chunks, and mapping each chunk to an integer ID.

The byte-level BPE tokenizer starts with a universal fallback:

<table class="token-table">
  <thead>
    <tr>
      <th>Initial token ID</th>
      <th>Token bytes</th>
      <th>Meaning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>0</code></td>
      <td><code>bytes([0])</code></td>
      <td>byte value 0</td>
    </tr>
    <tr>
      <td><code>1</code></td>
      <td><code>bytes([1])</code></td>
      <td>byte value 1</td>
    </tr>
    <tr>
      <td><code>...</code></td>
      <td><code>...</code></td>
      <td>...</td>
    </tr>
    <tr>
      <td><code>255</code></td>
      <td><code>bytes([255])</code></td>
      <td>byte value 255</td>
    </tr>
  </tbody>
</table>

<div class="aha-box">
<strong>Aha:</strong> byte-level BPE starts with 256 base tokens because there are 256 possible byte values, not because there are 256 Unicode characters. Any text can be encoded into UTF-8 bytes, so the tokenizer always has a fallback.
</div>

For English, many characters are one byte:

$$
\texttt{"t"} \to 116 \to \text{ID }116
$$

For Korean, one visible character may require multiple UTF-8 bytes:

$$
\texttt{"한"} \to [237, 149, 156]
$$

So initially, `"한"` might be represented by three byte-level token IDs. If it appears often enough in the training corpus, BPE may learn a merged token for those bytes, letting `"한"` become one token ID.

<div class="aha-box">
<strong>Aha:</strong> a single byte from a multi-byte UTF-8 character may not be a valid character by itself. The byte <code>237</code> from <code>"한"</code> is just the fragment <code>b"\xed"</code>; it only decodes properly together with the following bytes.
</div>

### BPE training

BPE training is where the vocabulary grows. The sequence gets more compact, but the vocabulary gets larger.

<div class="visual-block">
  <div class="visual-title">BPE training changes the vocabulary</div>
  <div class="visual-flow">
    <div class="flow-node">
      <strong>Pre-tokenize</strong>
      <small>"some text" -> ["some", " text"]</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Count chunks</strong>
      <small>{" text": 10}</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>UTF-8 bytes</strong>
      <small>(b" ", b"t", b"e", b"x", b"t")</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Count pairs</strong>
      <small>(b"t", b"e") += 10</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Merge max</strong>
      <small>(b"t", b"h") -> b"th"</small>
    </div>
  </div>
</div>

The high-level loop is:

1. Start with the 256 byte tokens, plus special tokens like `<|endoftext|>`.
2. Pre-tokenize raw text into rough chunks.
3. Count repeated pre-tokens.
4. Convert each pre-token to UTF-8 byte pieces.
5. Count adjacent byte/token pairs, weighted by pre-token frequency.
6. Merge the most frequent adjacent pair globally.
7. Repeat until the target vocab size is reached.

Example:

<table class="token-table">
  <thead>
    <tr>
      <th>Step</th>
      <th>Representation</th>
      <th>What changes?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Raw text</td>
      <td><code>"some text"</code></td>
      <td>Original string.</td>
    </tr>
    <tr>
      <td>Pre-tokenize</td>
      <td><code>["some", " text"]</code></td>
      <td>Rough chunks, often preserving leading spaces.</td>
    </tr>
    <tr>
      <td>Count</td>
      <td><code>{" text": 10}</code></td>
      <td>Repeated chunks are stored once with frequency.</td>
    </tr>
    <tr>
      <td>Bytes</td>
      <td><code>(b" ", b"t", b"e", b"x", b"t"): 10</code></td>
      <td>Every pre-token becomes byte pieces.</td>
    </tr>
    <tr>
      <td>Pair counts</td>
      <td><code>(b"t", b"e") += 10</code></td>
      <td>Adjacent pairs get weighted counts.</td>
    </tr>
    <tr>
      <td>Merge global max</td>
      <td><code>(b"t", b"h") -> b"th"</code></td>
      <td>Pick the most frequent adjacent pair across the full weighted corpus table, then add a new vocab token, e.g. <code>ID 256 -> b"th"</code>.</td>
    </tr>
  </tbody>
</table>

<div class="asset-figure">
  <img
    src="{{ '/assets/img/blog_img/cs336-lm-from-scratch/tokenizer-bpe-steps-1.png' | relative_url }}"
    alt="Handwritten tokenizer notes showing byte-level BPE initialization, pre-tokenization, UTF-8 bytes, and adjacent token pairs"
  />
  <p>My rough tokenizer sketch: byte fallback, pre-token frequency, UTF-8 byte pieces, and adjacent pair counts.</p>
</div>

<div class="asset-figure">
  <img
    src="{{ '/assets/img/blog_img/cs336-lm-from-scratch/tokenizer-bpe-steps-2.png' | relative_url }}"
    alt="Handwritten tokenizer notes showing merging the most frequent pair and repeating until target vocab size"
  />
  <p>The BPE loop keeps merging the most frequent adjacent pair until the target vocabulary size is reached.</p>
</div>

<div class="aha-box">
<strong>Aha:</strong> "most frequent pair" means the highest weighted adjacent-pair count across the whole tokenizer training corpus, not within one LM training batch. After each merge, the pre-token table changes, so the pair counts need to reflect the updated representation.
</div>

### BPE encoding

Encoding is different from training.

<div class="visual-block">
  <div class="visual-title">BPE encoding uses the learned merge ranks</div>
  <div class="two-column-visual">
    <div class="mini-panel">
      <h4>Start from bytes</h4>
      <div class="token-line">
        <span class="token-chip">b"t"</span>
        <span class="token-chip">b"h"</span>
        <span class="token-chip">b"e"</span>
      </div>
      <p class="mini-caption">No corpus-level counting happens during encoding.</p>
    </div>
    <div class="mini-panel">
      <h4>Apply earliest learned merges</h4>
      <div class="token-line">
        <span class="token-chip">b"t" + b"h" -> b"th"</span>
        <span class="token-chip">b"th" + b"e" -> b"the"</span>
      </div>
      <p class="mini-caption">Merge only pairs that exist in <code>merge_ranks</code>, in learned priority order.</p>
    </div>
  </div>
</div>

During encoding, the merges are already learned. We do not count frequencies again. For each pre-token:

1. Start from single-byte pieces.
2. List adjacent pairs currently present.
3. Keep only pairs that exist in the learned `merge_ranks`.
4. Merge the earliest learned pair.
5. Repeat until no learned pair applies.
6. Map final byte pieces to token IDs.

```python
pieces = [bytes([b]) for b in token_bytes]

while True:
    pairs = [(pieces[i], pieces[i + 1]) for i in range(len(pieces) - 1)]
    valid_pairs = [pair for pair in pairs if pair in merge_ranks]

    if not valid_pairs:
        break

    best_pair = min(valid_pairs, key=lambda pair: merge_ranks[pair])
    pieces = merge_everywhere(pieces, best_pair)
```

Special tokens add one more rule: split them out first. If the text contains `<|endoftext|>`, we encode that whole string as one ID, then run normal BPE only on the surrounding text.

<div class="aha-box">
<strong>Aha:</strong> tokenization decides <code>text &lt;-&gt; token IDs</code>. The embedding layer decides <code>token ID -&gt; learned vector</code>. Same integer ID, two different jobs.
</div>

<div class="visual-block">
  <div class="visual-title">Tokenizer output becomes embedding row indices</div>
  <div class="embedding-matrix">
    <div class="mini-panel">
      <h4>Text chunks</h4>
      <div class="token-line">
        <span class="token-chip">"the"</span>
        <span class="token-chip">" cat"</span>
        <span class="token-chip">" sat"</span>
      </div>
      <p class="mini-caption">The tokenizer decides these chunks using bytes and BPE merges.</p>
    </div>

    <div class="mini-panel">
      <h4>Token IDs index rows</h4>
      <div class="token-line">
        <span class="token-chip">391</span>
        <span class="token-chip">4821</span>
        <span class="token-chip">873</span>
      </div>
      <div class="embedding-mini-table" aria-label="Embedding matrix row lookup">
        <div class="embedding-row">
          <span>ID 0</span>
          <i class="embedding-cell"></i>
          <i class="embedding-cell"></i>
          <i class="embedding-cell"></i>
          <i class="embedding-cell"></i>
        </div>
        <div class="embedding-row highlight-row">
          <span>ID 391</span>
          <i class="embedding-cell"></i>
          <i class="embedding-cell"></i>
          <i class="embedding-cell"></i>
          <i class="embedding-cell"></i>
        </div>
        <div class="embedding-row">
          <span>ID 392</span>
          <i class="embedding-cell"></i>
          <i class="embedding-cell"></i>
          <i class="embedding-cell"></i>
          <i class="embedding-cell"></i>
        </div>
        <div class="embedding-row">
          <span>...</span>
          <i class="embedding-cell"></i>
          <i class="embedding-cell"></i>
          <i class="embedding-cell"></i>
          <i class="embedding-cell"></i>
        </div>
      </div>
    </div>

    <div class="mini-panel">
      <h4>Model input</h4>
      <div class="shape-line">
        <span class="shape-chip">[B, L]</span>
        <span class="flow-arrow">-></span>
        <span class="shape-chip">[B, L, D]</span>
      </div>
      <p class="mini-caption">The model never sees raw strings. It sees learned vectors selected by token IDs.</p>
    </div>
  </div>
</div>

---

## II. Embeddings and PyTorch shape conventions

After tokenization, the model sees integer IDs:

```python
token_ids = [[41, 93, 17, 10]]
```

The embedding layer is just a learned lookup table:

$$
E \in \mathbb{R}^{V \times D}
$$

where $V$ is vocab size and $D$ is model width. If token ID 41 appears, the model takes row 41 of `E`.

```python
class Embedding(torch.nn.Module):
    def __init__(self, vocab_size, d_model):
        super().__init__()
        self.weight = torch.nn.Parameter(torch.empty(vocab_size, d_model))

    def forward(self, token_ids):
        return self.weight[token_ids]
```

So the flow is:

$$
[B,L] \to [B,L,D]
$$

The other important shape convention is linear layers. Papers often write $Wx$ using column vectors. PyTorch usually stores activations as row/batched vectors:

$$
x \in \mathbb{R}^{\ldots \times d_{\text{in}}}
$$

So we store:

$$
W \in \mathbb{R}^{d_{\text{out}} \times d_{\text{in}}}
$$

and compute:

```python
y = x @ W.T
```

<div class="aha-box">
<strong>Aha:</strong> when papers write $Wx$, imagine column-vector math. In PyTorch, activations usually end in the feature dimension, so the practical form is <code>x @ W.T</code>.
</div>

---

## III. The Transformer block

The block I implemented is a pre-norm decoder block:

<div class="visual-block">
  <div class="visual-title">Pre-norm residual block</div>
  <div class="residual-visual">
    <div class="residual-row">
      <div class="residual-cell">x</div>
      <div class="residual-op">+</div>
      <div class="residual-cell">MHA(RMSNorm(x))</div>
      <div class="residual-op">=</div>
      <div class="residual-cell">x'</div>
    </div>
    <div class="residual-row">
      <div class="residual-cell">x'</div>
      <div class="residual-op">+</div>
      <div class="residual-cell">SwiGLU(RMSNorm(x'))</div>
      <div class="residual-op">=</div>
      <div class="residual-cell">block output</div>
    </div>
  </div>
  <p class="mini-caption">Normalize before each sublayer, then add the residual path back in.</p>
</div>

$$
x \leftarrow x + \text{MHA}(\text{RMSNorm}(x))
$$

$$
x \leftarrow x + \text{SwiGLU}(\text{RMSNorm}(x))
$$

Pre-norm means we normalize before the attention/FFN sublayer, then add the residual connection.

<div class="asset-figure">
  <img
    src="{{ '/assets/img/blog_img/cs336-lm-from-scratch/transformer-lm-prenorm-block.png' | relative_url }}"
    alt="Transformer language model overview and pre-norm Transformer block"
  />
  <p>Transformer LM overview and pre-norm Transformer block.</p>
</div>

### RMSNorm

LayerNorm subtracts the mean and rescales. RMSNorm only rescales by the root mean square:

$$
\text{RMS}(x) = \sqrt{\frac{1}{D}\sum_i x_i^2 + \epsilon}
$$

$$
\text{RMSNorm}(x)_i = \frac{x_i}{\text{RMS}(x)} g_i
$$

The learnable scale $g$ has shape `[d_model]`. It broadcasts across `[batch, sequence, d_model]`.

<div class="aha-box">
<strong>Aha:</strong> RMSNorm does not remove the row mean. It rescales magnitude, then lets one learned multiplier per hidden dimension decide how much to amplify each coordinate.
</div>

### Multi-head attention shape flow

The packed projection gives Q/K/V in model width:

<div class="visual-block">
  <div class="visual-title">MHA is mostly a reshape story</div>
  <div class="visual-flow">
    <div class="flow-node">
      <strong>Project</strong>
      <small>[B,L,D] -> [B,L,D]</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Split heads</strong>
      <small>[B,L,H,d_k]</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Transpose</strong>
      <small>[B,H,L,d_k]</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Attend over L</strong>
      <small>QK.T -> [B,H,L,L]</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Reverse</strong>
      <small>[B,H,L,d_k] -> [B,L,D]</small>
    </div>
  </div>
</div>

$$
[B,L,D] \to [B,L,D]
$$

Then we split the final feature dimension into heads:

```python
Q = q_proj(x).reshape(B, L, H, d_k)
K = k_proj(x).reshape(B, L, H, d_k)
V = v_proj(x).reshape(B, L, H, d_k)
```

Then transpose so attention runs over sequence length inside each head:

```python
Q = Q.transpose(-3, -2)  # [B, H, L, d_k]
K = K.transpose(-3, -2)
V = V.transpose(-3, -2)
```

The attention matrix is `[B, H, L, L]`, where each row says which previous tokens that position reads from.

After attention, we reverse the shape path:

```python
out = attention(Q, K, V)          # [B, H, L, d_k]
out = out.transpose(-3, -2)       # [B, L, H, d_k]
out = out.reshape(B, L, D)        # [B, L, D]
```

<div class="aha-box">
<strong>Aha:</strong> MHA merge is literally the reverse of the split: project, reshape, transpose; then transpose, reshape, output project.
</div>

### SwiGLU

SwiGLU is the feed-forward block:

$$
\text{SwiGLU}(x) = W_2(\text{SiLU}(W_1x) \odot W_3x)
$$

In PyTorch row-vector shape:

```python
gate = silu(x @ W1.T)    # [..., d_ff]
value = x @ W3.T         # [..., d_ff]
hidden = gate * value    # [..., d_ff]
out = hidden @ W2.T      # [..., d_model]
```

The `SiLU` part is:

$$
\text{SiLU}(a) = a \cdot \sigma(a) = \frac{a}{1 + e^{-a}}
$$

So the `W1` branch is not just another plain projection. It makes a data-dependent gate for every token and every hidden feature. Large positive gate inputs mostly pass through, large negative gate inputs get pushed close to zero, and values near zero are softened smoothly. Then `gate * value` says: for this token, which expanded features from the `W3` branch should be emphasized or muted before projecting back down?

<div class="aha-box">
<strong>Aha:</strong> $W_1$ and $W_3$ both project up to $d_{\text{ff}}$. $W_1$ produces the SiLU gate, $W_3$ produces the value branch, and the elementwise product lets the model modulate each expanded feature before $W_2$ projects back down to $d_{\text{model}}$.
</div>

---

## IV. RoPE: position through rotation

Self-attention compares token vectors with dot products. Without positional information, the model knows which tokens exist, but not where they occur. Absolute position embeddings attach a learned vector to index 0, 1, 2, and so on, but that has two limitations:

- positions beyond the trained context length have no learned vector,
- relative distance has to be learned indirectly.

RoPE takes a different route. It rotates query and key vectors by their token position.

One thing that confused me at first: this is not merging or rotating adjacent **tokens**. RoPE rotates adjacent **feature dimensions inside one token's Q/K vector**.

If a single head has $d_k = 8$, then one query vector at position $i$ looks like:

$$
q_i = [q_{i,0}, q_{i,1}, q_{i,2}, q_{i,3}, q_{i,4}, q_{i,5}, q_{i,6}, q_{i,7}]
$$

RoPE groups adjacent feature dimensions inside that vector: $(0,1)$, $(2,3)$, $(4,5)$, and $(6,7)$. The token-to-token interaction happens later, when the rotated queries and keys are used in $QK^\top$. RoPE itself is a within-vector rotation.

<details class="refresher" markdown="1">
<summary>Dimension-pairing view for one head</summary>

For $d_k = 8$, the pair index $k$ chooses which two coordinates get one 2D rotation.

| Pair index | Feature dimensions inside one token vector | Angle used |
| --- | --- | --- |
| `0` | `(q[i, 0], q[i, 1])` | $\theta_{i,0}$ |
| `1` | `(q[i, 2], q[i, 3])` | $\theta_{i,1}$ |
| `2` | `(q[i, 4], q[i, 5])` | $\theta_{i,2}$ |
| `3` | `(q[i, 6], q[i, 7])` | $\theta_{i,3}$ |

This is why `x[..., 0::2]` and `x[..., 1::2]` show up in the implementation: they split all even and odd coordinates into the paired coordinates that RoPE rotates.

</details>

Important detail:

<div class="aha-box">
<strong>Aha:</strong> RoPE is applied after creating Q and K, not directly to the raw token embeddings. It modifies the geometry of the attention dot product.
</div>

<div class="visual-block">
  <div class="visual-title">RoPE changes the attention geometry</div>
  <div class="visual-flow">
    <div class="flow-node">
      <strong>Content</strong>
      <small>make Q and K</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Position rotation</strong>
      <small>rotate by token index</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Attention score</strong>
      <small>rotated Q dot rotated K</small>
    </div>
    <div class="flow-arrow">-></div>
    <div class="flow-node">
      <strong>Relative offset</strong>
      <small>distance j - i appears</small>
    </div>
  </div>
</div>

For a 2D pair, the rotation matrix is:

$$
R(\theta) =
\begin{bmatrix}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta
\end{bmatrix}
$$

The key identity is:

$$
R(\alpha)^\top R(\beta) = R(\beta - \alpha)
$$

So if token $m$ gets rotation $R(m\theta)$, and token $n$ gets rotation $R(n\theta)$, their attention dot product becomes:

$$
(R(m\theta)x)^\top (R(n\theta)y)
= x^\top R((n-m)\theta)y
$$

That is the core RoPE idea. The attention score now depends on the relative offset $n-m$, not just the two content vectors. If both positions shift by the same amount $k$, the relative spacing stays the same.

<details class="refresher" markdown="1">
<summary>Derivation: why the relative-position term appears</summary>

The trig identities I want to remember are:

$$
\sin(\alpha)\sin(\beta)
= \frac{1}{2}\left[\cos(\alpha-\beta)-\cos(\alpha+\beta)\right]
$$

$$
\cos(\alpha)\cos(\beta)
= \frac{1}{2}\left[\cos(\alpha-\beta)+\cos(\alpha+\beta)\right]
$$

$$
\sin(\alpha)\cos(\beta)
= \frac{1}{2}\left[\sin(\alpha+\beta)+\sin(\alpha-\beta)\right]
$$

$$
\cos(\alpha)\sin(\beta)
= \frac{1}{2}\left[\sin(\alpha+\beta)-\sin(\alpha-\beta)\right]
$$

For the rotation matrix:

$$
R(\theta) =
\begin{bmatrix}
\cos \theta & -\sin \theta \\
\sin \theta & \cos \theta
\end{bmatrix}
$$

we have:

$$
R(\alpha)^\top =
\begin{bmatrix}
\cos \alpha & \sin \alpha \\
-\sin \alpha & \cos \alpha
\end{bmatrix}
$$

Now multiply:

$$
R(\alpha)^\top R(\beta)
=
\begin{bmatrix}
\cos\alpha\cos\beta+\sin\alpha\sin\beta
&
-\cos\alpha\sin\beta+\sin\alpha\cos\beta \\
-\sin\alpha\cos\beta+\cos\alpha\sin\beta
&
\sin\alpha\sin\beta+\cos\alpha\cos\beta
\end{bmatrix}
$$

Using angle-difference identities:

$$
\cos(\beta-\alpha)=\cos\beta\cos\alpha+\sin\beta\sin\alpha
$$

$$
\sin(\beta-\alpha)=\sin\beta\cos\alpha-\cos\beta\sin\alpha
$$

we get:

$$
R(\alpha)^\top R(\beta)
=
\begin{bmatrix}
\cos(\beta-\alpha) & -\sin(\beta-\alpha) \\
\sin(\beta-\alpha) & \cos(\beta-\alpha)
\end{bmatrix}
= R(\beta-\alpha)
$$

The reason the sign cleans up is that cosine is even and sine is odd:

$$
\cos(-\theta)=\cos(\theta),
\qquad
\sin(-\theta)=-\sin(\theta)
$$

Now apply this to the RoPE dot product:

$$
\text{RoPE}(x,m)^\top \text{RoPE}(y,n)
= x^\top R(m\theta)^\top R(n\theta)y
= x^\top R((n-m)\theta)y
$$

If both positions shift by the same amount $k$:

$$
\text{RoPE}(x,m+k)^\top \text{RoPE}(y,n+k)
= x^\top R((m+k)\theta)^\top R((n+k)\theta)y
= x^\top R((n-m)\theta)y
$$

The same relative spacing produces the same relative rotation.

</details>

<div class="aha-box">
<strong>Aha:</strong> RoPE does not replace content attention. It adds relative-distance geometry to Q/K dot products. Some dimension pairs rotate quickly for local offsets; others rotate slowly for longer-range offsets.
</div>

### Full matrix idea

For a head dimension $d_k$, RoPE conceptually builds a block-diagonal matrix:

$$
R_i =
\begin{bmatrix}
R_i^1 & 0 & 0 & \cdots & 0 \\
0 & R_i^2 & 0 & \cdots & 0 \\
0 & 0 & R_i^3 & \cdots & 0 \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
0 & 0 & 0 & \cdots & R_i^{d_k/2}
\end{bmatrix}
$$

Each block rotates one pair of dimensions. Building this full matrix would be wasteful.

For one pair $k$ at token position $i$, the actual operation is:

$$
\begin{bmatrix}
q'_{i,2k} \\
q'_{i,2k+1}
\end{bmatrix}
=
\begin{bmatrix}
\cos(\theta_{i,k}) & -\sin(\theta_{i,k}) \\
\sin(\theta_{i,k}) & \cos(\theta_{i,k})
\end{bmatrix}
\begin{bmatrix}
q_{i,2k} \\
q_{i,2k+1}
\end{bmatrix}
$$

So the first row of the rotation matrix gives the new even coordinate:

$$
q'_{i,2k}
= q_{i,2k}\cos(\theta_{i,k})
- q_{i,2k+1}\sin(\theta_{i,k})
$$

and the second row gives the new odd coordinate:

$$
q'_{i,2k+1}
= q_{i,2k}\sin(\theta_{i,k})
+ q_{i,2k+1}\cos(\theta_{i,k})
$$

<div class="aha-box">
<strong>Aha:</strong> <code>cos</code> and <code>-sin</code> are not just being "applied to the even index." They are the first row of the 2x2 rotation matrix, so the new even coordinate is a combination of the old even and old odd coordinates.
</div>

Instead, precompute:

$$
\cos(\theta_{i,k}),\quad \sin(\theta_{i,k})
$$

for every position $i$ and pair index $k$, then apply the 2D rotation directly to even and odd coordinates.

<div class="asset-figure">
  <img
    src="{{ '/assets/img/blog_img/cs336-lm-from-scratch/rope-precomputed-tables.png' | relative_url }}"
    alt="Handwritten RoPE notes showing the 2D rotation matrix, theta formula, and precomputed cosine and sine tables"
  />
  <p>The precomputed RoPE tables store one row per token position and one column per even/odd feature pair.</p>
</div>

<div class="visual-block">
  <div class="visual-title">One 2D pair rotation, written tensor-style</div>
  <div class="rope-pair-visual">
    <div class="rope-vector">
      <div class="rope-box">old_even = a</div>
      <div class="rope-box">old_odd = b</div>
    </div>
    <div class="rope-formula">
      new_even = a * cos - b * sin<br/>
      new_odd&nbsp; = a * sin + b * cos
    </div>
    <div class="rope-result">
      <div class="rope-box">out[..., 0::2]</div>
      <div class="rope-box">out[..., 1::2]</div>
    </div>
  </div>
  <p class="mini-caption">The full block matrix is conceptually helpful, but this pairwise formula is what the implementation actually wants.</p>
</div>

```python
old_even = x[..., 0::2]
old_odd = x[..., 1::2]

new_even = old_even * cos - old_odd * sin
new_odd = old_even * sin + old_odd * cos

out[..., 0::2] = new_even
out[..., 1::2] = new_odd
```

<div class="asset-figure">
  <img
    src="{{ '/assets/img/blog_img/cs336-lm-from-scratch/rope-even-odd.png' | relative_url }}"
    alt="Handwritten RoPE notes showing how the first and second rows of the 2D rotation matrix become even and odd coordinate updates"
  />
  <p>For each feature pair, the first row of the 2D rotation matrix produces the new even coordinate, and the second row produces the new odd coordinate.</p>
</div>

<div class="asset-figure">
  <img
    src="{{ '/assets/img/blog_img/cs336-lm-from-scratch/rope-generalizing.png' | relative_url }}"
    alt="Handwritten RoPE notes generalizing the even and odd coordinate updates across positions and feature pairs"
  />
  <p>Generalizing the trick: split all even and odd feature columns, select the matching position rows from the precomputed sin/cos tables, then apply the same row-wise rotation everywhere.</p>
</div>

The sin/cos values are not learned parameters. They are fixed buffers, reused across batches and layers:

```python
self.register_buffer("cos_angles", cos_table, persistent=False)
self.register_buffer("sin_angles", sin_table, persistent=False)
```

A more complete version of the implementation looks like:

```python
class RotaryPositionalEmbedding(torch.nn.Module):
    def __init__(self, theta: float, d_k: int, max_seq_len: int, device=None):
        super().__init__()

        positions = torch.arange(max_seq_len, device=device)      # [max_seq_len]
        pair_idx = torch.arange(d_k // 2, device=device)          # [d_k / 2]

        inv_freq = 1.0 / (theta ** (2 * pair_idx / d_k))
        angles = positions[:, None] * inv_freq[None, :]           # [max_seq_len, d_k / 2]

        self.register_buffer("cos_angles", torch.cos(angles), persistent=False)
        self.register_buffer("sin_angles", torch.sin(angles), persistent=False)

    def forward(self, x: torch.Tensor, token_positions: torch.Tensor) -> torch.Tensor:
        # x is usually Q or K with shape [B, H, L, d_k]
        # token_positions is usually [L], e.g. [0, 1, 2, ..., L-1]

        old_even = x[..., 0::2]  # [B, H, L, d_k / 2]
        old_odd = x[..., 1::2]   # [B, H, L, d_k / 2]

        cos = self.cos_angles[token_positions]  # [L, d_k / 2]
        sin = self.sin_angles[token_positions]  # [L, d_k / 2]

        out = torch.empty_like(x)
        out[..., 0::2] = old_even * cos - old_odd * sin
        out[..., 1::2] = old_even * sin + old_odd * cos
        return out
```

The reason this broadcasts is that `cos` and `sin` have shape `[L, d_k / 2]`, which lines up with the last two dimensions of `old_even` and `old_odd`. The batch and head dimensions are leading dimensions, so PyTorch reuses the same position-angle table across batches and heads.

Then in attention:

```python
Q = self.rope(Q, token_positions)
K = self.rope(K, token_positions)
# V is not rotated.
```

<div class="aha-box">
<strong>Aha:</strong> the even/odd split is the same math as the block-diagonal rotation matrix. It is just written in the form tensors want.
</div>

---

## V. Training: many next-token predictions at once

The language modeling dataset is usually treated as one long stream of token IDs. Every step samples random windows:

<div class="visual-block">
  <div class="visual-title">One chunk gives many supervised examples</div>
  <div class="two-column-visual">
    <div class="mini-panel">
      <h4>Input window</h4>
      <div class="token-line">
        <span class="token-chip">the</span>
        <span class="token-chip">cat</span>
        <span class="token-chip">sat</span>
        <span class="token-chip">on</span>
      </div>
    </div>
    <div class="mini-panel">
      <h4>Shifted targets</h4>
      <div class="token-line">
        <span class="token-chip">cat</span>
        <span class="token-chip">sat</span>
        <span class="token-chip">on</span>
        <span class="token-chip">mat</span>
      </div>
    </div>
  </div>
  <p class="mini-caption">Causal attention makes each row a prefix task, so the whole chunk trains in parallel without future-token leakage.</p>
</div>

```python
x = tokens[start : start + L]
y = tokens[start + 1 : start + L + 1]
```

For a toy chunk:

```text
x text:    the   cat   sat   on
y text:    cat   sat   on    mat
```

The Transformer keeps the sequence dimension:

$$
[B,L] \to [B,L,D] \to [B,L,V]
$$

Each position gets its own next-token logits.

<div class="aha-box">
<strong>Aha:</strong> chunk training is parallelized prefix training. One forward pass trains <code>[the] -> cat</code>, <code>[the, cat] -> sat</code>, <code>[the, cat, sat] -> on</code>, and so on. The causal mask prevents future-token leakage.
</div>

The LM head is position-wise:

```python
logits[:, i, :] = lm_head(hidden[:, i, :])
```

It is not cheating because the hidden state at position $i$ only contains information from tokens $\leq i$. The future blocking already happened inside causal attention.

### Cross entropy

The model outputs logits, not probabilities:

$$
\text{logits} \in \mathbb{R}^{B \times L \times V}
$$

For loss, flatten batch and sequence positions:

```python
loss = cross_entropy(logits.reshape(-1, V), targets.reshape(-1))
```

That converts:

$$
[B,L,V] \to [B \cdot L,V]
$$

and:

$$
[B,L] \to [B \cdot L]
$$

The stable cross entropy identity I want to remember is:

$$
\text{CE}(z,y) = \log\sum_j e^{z_j} - z_y
$$

and with the max trick:

$$
\text{CE}(z,y)
= m + \log\sum_j e^{z_j - m} - z_y,
\quad m = \max_j z_j
$$

The reason subtracting $m$ is legal is that softmax does not change when every logit is shifted by the same constant:

$$
\text{softmax}(z)_y
=
\frac{e^{z_y}}{\sum_j e^{z_j}}
=
\frac{e^{z_y-m}}{\sum_j e^{z_j-m}}
$$

because both numerator and denominator are multiplied by the same factor $e^{-m}$:

$$
\frac{e^{z_y-m}}{\sum_j e^{z_j-m}}
=
\frac{e^{-m}e^{z_y}}{e^{-m}\sum_j e^{z_j}}
=
\frac{e^{z_y}}{\sum_j e^{z_j}}
$$

Then cross entropy is just negative log of the correct-token probability:

$$
\begin{aligned}
\text{CE}(z,y)
&= -\log \frac{e^{z_y-m}}{\sum_j e^{z_j-m}} \\
&= -\left((z_y-m) - \log\sum_j e^{z_j-m}\right) \\
&= -z_y + m + \log\sum_j e^{z_j-m}.
\end{aligned}
$$

So this is mathematically the same softmax probability. The exponentials are safer because the max shift guarantees:

$$
z_j - m \leq 0
\quad\Longrightarrow\quad
e^{z_j-m} \leq 1
$$

<div class="aha-box">
<strong>Aha:</strong> cross entropy pushes up the correct token's logit relative to all other logits. The stable log-sum-exp form avoids computing tiny probabilities and then taking <code>log</code>.
</div>

Perplexity is the same information on a more intuitive scale:

$$
\exp(-\log p_{\text{correct}}) = \frac{1}{p_{\text{correct}}}
$$

Across many tokens, it is the inverse geometric mean probability assigned to the correct next token.

---

## VI. Optimizer, schedule, clipping, checkpointing

The training-loop part I want to remember is how the scheduler and global gradient clipping show up in code:

```python
for it in range(start_iter, args.max_iters):
    lr = get_lr_cosine_schedule(
        it=it,
        max_learning_rate=args.max_lr,
        min_learning_rate=args.min_lr,
        warmup_iters=args.warmup_iters,
        cosine_cycle_iters=args.cosine_cycle_iters,
    )

    for group in optimizer.param_groups:
        group["lr"] = lr

    x, y = get_batch(train_ids, args.batch_size, args.context_length, device)

    optimizer.zero_grad()
    logits = model(x)  # [B, L, V]
    loss = cross_entropy(logits.reshape(-1, vocab_size), y.reshape(-1))
    loss.backward()

    gradient_clipping(model.parameters(), args.max_grad_norm)
    optimizer.step()
```

<div class="aha-box">
<strong>Aha:</strong> the learning-rate schedule is applied to the optimizer's parameter groups, so it changes the LR used by all parameters in that group. In the usual simple setup, there is one parameter group containing the whole model.
</div>

For the cosine learning-rate schedule, the useful shape trick is:

$$
s = \frac{t - T_w}{T_c - T_w}
$$

This maps the decay interval $[T_w, T_c]$ into progress $s \in [0,1]$. Then:

$$
\frac{1}{2}(1 + \cos(\pi s))
$$

smoothly moves from 1 to 0, mapping $\alpha_{\max}$ to $\alpha_{\min}$.

Gradient clipping has to come after `loss.backward()` for a simple reason: `backward()` is the step that computes and stores the current gradients in each parameter's `.grad` field. Before that, there is nothing from the current loss to clip.

The important detail is that this clipping is global. **It calculates one L2 norm across the entire set of gradients:**

$$
\lVert g \rVert_2
=
\sqrt{\sum_{\text{parameters }p}\sum_{\text{entries }r} g_{p,r}^2}
$$

**Then it applies one shared scale factor to every gradient tensor if the norm is too large**, meaning it goes beyond the chosen `max_l2_norm`.

```python
def gradient_clipping(
    parameters: Iterable[torch.nn.Parameter],
    max_l2_norm: float,
) -> None:
    """Clip gradients in-place by global L2 norm."""
    eps = 1e-6

    grads = [p.grad for p in parameters if p.grad is not None]
    if len(grads) == 0:
        return

    total_sq_sum = sum(torch.sum(g**2) for g in grads)
    l2_norm = torch.sqrt(total_sq_sum)

    if l2_norm >= max_l2_norm:
        scale = max_l2_norm / (l2_norm + eps)
        for g in grads:
            g.mul_(scale)
```

<div class="aha-box">
<strong>Aha:</strong> each parameter tensor has its own gradient chunk, but gradient clipping treats all chunks as one giant gradient vector. It computes one L2 norm, one scale factor, and multiplies every gradient tensor by that same scale. This preserves the direction of the whole-model update while shrinking its magnitude.
</div>

AdamW then uses those clipped gradients inside `optimizer.step()`. AdamW still keeps per-parameter moment state like $m$, $v$, and $t$, but the clipping decision happened globally before the optimizer update.

AdamW also decouples weight decay from the gradient:

$$
\theta \leftarrow \theta - \alpha \lambda \theta
$$

<div class="aha-box">
<strong>Aha:</strong> weight decay is not looking at the current gradient direction. It gently shrinks weights toward zero as regularization, while Adam handles the gradient-based update after clipping.
</div>

<details class="refresher" markdown="1">
<summary>Resource accounting aha: why AdamW is 4P and where the FLOPs formulas come from</summary>

Let $P$ be the number of trainable scalar parameters. I sometimes wrote this as $N$, but I will use $P$ here so it does not collide with `num_layers`.

For the assignment architecture, ignoring biases:

$$
P
=
2VD
+ n_{\text{layers}}(4D^2 + 3DF + 2D)
+ D
$$

where:

- $V$ is vocab size,
- $D$ is `d_model`,
- $F$ is `d_ff`,
- $2VD$ is token embedding plus LM head,
- $4D^2$ is Q/K/V/output projection inside attention,
- $3DF$ is the three SwiGLU matrices,
- $2D$ is the two RMSNorm weights inside each block,
- the final $D$ is the last RMSNorm.

AdamW memory is easy to undercount because the optimizer is stateful. Around an optimizer step, the training run stores:

| Tensor kind | Size |
| --- | --- |
| parameters $\theta$ | $P$ floats |
| gradients $g$ | $P$ floats |
| Adam first moment $m$ | $P$ floats |
| Adam second moment $v$ | $P$ floats |

So parameter/gradient/AdamW persistent memory is:

$$
P + P + P + P = 4P \text{ floats}
$$

With float32, that is:

$$
4P \times 4 \text{ bytes} = 16P \text{ bytes}
$$

Equivalently, if $N$ means "number of parameters", then this is $4N$ floats. The optimizer state alone is $2P$ floats, because it is just $m$ and $v$. Activations are extra and depend on batch size, context length, and which intermediate tensors are saved for backward.

For FLOPs, the one rule I want to keep in my head is:

$$
[m,n] @ [n,p] \to [m,p]
\quad\Rightarrow\quad
2mnp \text{ FLOPs}
$$

The factor of 2 is multiply plus add along the collapsed dimension $n$.

For one batch, let $B$ be batch size and $S$ be sequence length. Each Transformer layer has:

| Component | Shape reason | FLOPs |
| --- | --- | --- |
| QKV projections | three $[BS,D] @ [D,D]$ multiplies | $6BSD^2$ |
| Attention scores $QK^\top$ | per head $[S,d_k] @ [d_k,S]$, summed over heads | $2BS^2D$ |
| Weighted values $AV$ | per head $[S,S] @ [S,d_k]$, summed over heads | $2BS^2D$ |
| Output projection | one $[BS,D] @ [D,D]$ multiply | $2BSD^2$ |
| SwiGLU FFN | $W_1$, $W_3$, and $W_2$ | $6BSDF$ |

Across all layers, multiply those layer costs by $n_{\text{layers}}$. The LM head adds:

$$
2BSDV
$$

because it is $[BS,D] @ [D,V]$.

The quick intuition:

- FFN/projections scale like $S D^2$ or $SDF$,
- attention matrix multiplies scale like $S^2D$,
- so longer context makes attention grow much faster,
- bigger model width/depth makes projections and FFN heavier.

</details>

Finally, checkpointing is simply saving:

- model state,
- optimizer state,
- current iteration.

This matters because AdamW's moment estimates are part of training state. Restarting with only the model weights is not the same as resuming training.

---

## VII. Decoding: use the last row

Training predicts next-token logits at every position. Decoding only needs the final position.

<div class="visual-block">
  <div class="visual-title">Training uses every row; decoding uses the last row</div>
  <div class="two-column-visual">
    <div class="mini-panel">
      <h4>Training</h4>
      <div class="shape-line">
        <span class="shape-chip">[B,L,V]</span>
        <span class="flow-arrow">-></span>
        <span class="shape-chip">loss over B*L rows</span>
      </div>
      <p class="mini-caption">Every position contributes a next-token prediction.</p>
    </div>
    <div class="mini-panel">
      <h4>Decoding</h4>
      <div class="shape-line">
        <span class="shape-chip">[1,T,V]</span>
        <span class="flow-arrow">-></span>
        <span class="shape-chip">logits[0, -1, :]</span>
      </div>
      <p class="mini-caption">Sample one token, append it, then run the loop again.</p>
    </div>
  </div>
</div>

Given prompt token IDs:

```python
context_ids = generated_ids[-context_length:]
logits = model(context_ids)[..., -1, :]
```

For a prompt like `Hi I am going`, the model still returns one logits row per input position:

```text
input tokens:   Hi        I        am        going
output rows:    next(Hi)  next(I)  next(am)  next(going)
decode uses:                                  ^ this row
```

During training, that last row would be compared against the actual next token from the dataset. During decoding, that next token is unknown, so we sample it from `next(going)`, append it, and repeat.

Then decode one token:

```python
if temperature <= 0:
    next_id = torch.argmax(logits)
else:
    probs = torch.softmax(logits / temperature, dim=-1)
    next_id = torch.multinomial(probs, num_samples=1)
```

Top-p sampling first sorts tokens by probability, keeps the smallest prefix whose probability mass exceeds $p$, renormalizes, and samples from that smaller set.

<div class="aha-box">
<strong>Aha:</strong> the model predicts token IDs, not variable-length bytes directly. The sampled ID may decode to one byte, a whole word piece, Korean bytes, or a special token. Variable text length only matters when converting IDs back to text.
</div>

If the sampled token is `<|endoftext|>`, generation can stop. If it does not appear, generation stops at the chosen maximum token limit.

---

## Final mental picture

The pieces feel much less mysterious when I separate the levels:

1. **Tokenizer:** defines the discrete vocabulary and maps text to IDs.
2. **Embedding:** gives each ID a learned vector.
3. **RoPE + attention:** lets each position read previous positions with relative-position geometry.
4. **Transformer block:** repeatedly mixes and transforms prefix information.
5. **LM head:** maps every hidden row to vocab logits.
6. **Cross entropy:** pushes up the correct next-token logit.
7. **Optimizer/training loop:** turns those losses into stable parameter updates.
8. **Decoder:** repeatedly reads the last-position logits and appends one sampled ID.

That is the building-block view I want to keep.
