---
layout: post
title: "Minimum Math Review for Diffusion LM"
date: 2026-01-02
description: "Review For Myself"
tags: [ml, notes]
categories: [technical-blogs]
featured: true
math: true
---

This is my “future-me friendly” math review notes required to understand Diffusion Language Model.

---

**DDPM** (Denoising Diffusion Probabilistic Models):
The goal is to simplify the original variational objective into the famous **noise-prediction MSE** loss.

- We define a forward noising process $q$.
- The VLB contains KL terms that compare a **true posterior** $q(x_{t-1}\mid x_t, x_0)$ to a **learned reverse** $p_\theta(x_{t-1}\mid x_t)$.
- During **training** we know the clean sample $x_0$ (it’s the data), but during **sampling** we do not know $x_0$.
- We derive the true posterior $q(x_{t-1}\mid x_t, x_0)$ using Bayes (Step 3).
- KL between Gaussians becomes “match means” (Step 4).
- That mean can be rewritten in terms of injected noise $\epsilon$, so the model can learn to predict $\epsilon_\theta(x_t,t)$.

#### 1) The Forward Process: Recursive Destruction

The forward process $q$ is a Markov chain that gradually turns a clean data point $x_0$ into noise. Define each step as:

$$
q(x_t \mid x_{t-1})=\mathcal{N}\!\left(x_t;\sqrt{1-\beta_t}\,x_{t-1},\beta_t I\right).
$$

Let $\alpha_t = 1-\beta_t$. Using the reparameterization trick:

$$
x_t=\sqrt{\alpha_t}\,x_{t-1}+\sqrt{1-\alpha_t}\,\epsilon,
\quad \epsilon\sim\mathcal{N}(0,I).
$$

#### The Accumulated Noise Sum → the “Jump Formula”

If we unroll this recursion, $x_t$ becomes “signal + a sum of independent Gaussian noises.” Since a sum of independent Gaussians is Gaussian, we can collapse the entire noise sum into a single $\epsilon$. This gives the jump formula:

$$
x_t=\sqrt{\bar{\alpha}_t}\,x_0+\sqrt{1-\bar{\alpha}_t}\,\epsilon,
\qquad
\bar{\alpha}_t=\prod_{i=1}^t \alpha_i.
$$

From this:

$$
\mathbb{E}[x_t\mid x_0]=\sqrt{\bar{\alpha}_t}\,x_0,
\qquad
\mathrm{Var}(x_t\mid x_0)=(1-\bar{\alpha}_t)I.
$$

---

#### 2) The Original Training Objective (VLB)

Below is the variational lower bound objective. I’ll call it $\mathcal{L}_{\mathrm{vlb}}$.

$$
\mathcal{L}_{\mathrm{vlb}}
=
\mathbb{E}_q\Big[
\underbrace{D_{KL}(q(x_T\mid x_0)\,\|\,p(x_T))}_{L_T}
+
\sum_{t=2}^{T}
\underbrace{D_{KL}(q(x_{t-1}\mid x_t,x_0)\,\|\,p_\theta(x_{t-1}\mid x_t))}_{L_{t-1}}
+
\underbrace{-\log p_\theta(x_0\mid x_1)}_{L_0}
\Big].
$$

#### Quick clarification (easy to mix up)

- **Sampling time:** we do _not_ know $x_0$ and we do _not_ know $x_{t-1}$ yet. We only have the current noisy state $x_t$, and we sample the previous state using the model: $x_{t-1}\sim p_\theta(x_{t-1}\mid x_t)$.
- **Training time:** we _do_ know $x_0$ because it’s the training example, and we also know the forward process $q$. That’s why the VLB can include the “peeking” posterior $q(x_{t-1}\mid x_t, x_0)$: even though we can’t use $x_0$ at sampling time, we can use it during training to derive the correct reverse-step distribution and train the model to match it.

#### Intuition for each VLB term

#### (A) The Prior Term ($L_T$)

This is:

$$
L_T = D_{KL}(q(x_T\mid x_0)\,\|\,p(x_T)).
$$

**What it is:** This term checks if your forward process successfully turned your data into **“pure noise”** by time $T$.

- $q(x_T\mid x_0)$ is what you get after applying your noise schedule all the way to the end.
- $p(x_T)$ is the “simple” noise distribution you want to end up with (usually $\mathcal{N}(0,I)$).

**Intuition:** “Did I destroy the data enough that the final state looks like a clean, standard Gaussian?”  
If yes, sampling can start from $x_T\sim\mathcal{N}(0,I)$ and work backwards.

#### (B) The Denoising Terms ($L_{t-1}$)

This is:

$$
L_{t-1} = D_{KL}(q(x_{t-1}\mid x_t,x_0)\,\|\,p_\theta(x_{t-1}\mid x_t)).
$$

**What it is:** This is the **meat** of diffusion training.

- $q(x_{t-1}\mid x_t,x_0)$ is the true reverse step if you know both the noisy point $x_t$ and the original clean sample $x_0$ (available during training).
- $p_\theta(x_{t-1}\mid x_t)$ is what the model will use at sampling time (when $x_0$ is unknown).

**Intuition:** “Can the model learn to undo one step of corruption?”  
Because we sum from $t=2$ to $T$, we train it to undo every noise level, from very noisy to barely noisy.

#### (C) The Reconstruction Term ($L_0$)

This is:

$$
L_0 = -\log p_\theta(x_0\mid x_1).
$$

**What it is:** This is the **last mile**.

- By the time you reach $x_1$, things are only slightly fuzzy.
- The model needs to output a distribution that puts high probability on the real clean image $x_0$.

**Intuition:** “Turn the slightly fuzzy $x_1$ into the perfectly clean $x_0$.”

---

#### 3) Step 3: The “Bayes Trick” (derive the true posterior)

We compute the true posterior of the forward process using Bayes’ rule:

$$
P(A\mid B,C)=\frac{P(B\mid A,C)P(A\mid C)}{P(B\mid C)}.
$$

We map:

- $A=x_{t-1}$: the previous latent we want
- $B=x_t$: the noisy latent we have
- $C=x_0$: the clean data point (available during training)

So:

$$
q(x_{t-1}\mid x_t,x_0)
=
\frac{q(x_t\mid x_{t-1},x_0)\,q(x_{t-1}\mid x_0)}{q(x_t\mid x_0)}.
$$

Now use the Markov property (given $x_{t-1}$, $x_t$ doesn’t depend on $x_0$):

$$
q(x_t\mid x_{t-1},x_0)=q(x_t\mid x_{t-1}).
$$

Thus:

$$
q(x_{t-1}\mid x_t,x_0)
=
q(x_t\mid x_{t-1})\;\frac{q(x_{t-1}\mid x_0)}{q(x_t\mid x_0)}.
$$

#### Summing exponents & completing the square (why it stays Gaussian)

All three terms are Gaussians, and Gaussians have the form:

$$
\mathcal{N}(z;\mu,\sigma^2)\propto \exp\left(-\frac{(z-\mu)^2}{2\sigma^2}\right).
$$

So multiplying/dividing Gaussians adds/subtracts quadratic exponents. Writing the exponent in terms of $x_{t-1}$ yields (up to constants):

$$
\frac{(x_t-\sqrt{\alpha_t}x_{t-1})^2}{\beta_t}
+
\frac{(x_{t-1}-\sqrt{\bar{\alpha}_{t-1}}x_0)^2}{1-\bar{\alpha}_{t-1}}
-
\frac{(x_t-\sqrt{\bar{\alpha}_t}x_0)^2}{1-\bar{\alpha}_t}.
$$

Completing the square gives a Gaussian posterior:

$$
q(x_{t-1}\mid x_t,x_0)=\mathcal{N}(\tilde{\mu}_t(x_t,x_0),\,\tilde{\beta}_t I).
$$

#### Posterior mean (the key blend)

$$
\tilde{\mu}_t(x_t,x_0)=
\frac{\sqrt{\alpha_t}(1-\bar{\alpha}_{t-1})}{1-\bar{\alpha}_t}\,x_t
+
\frac{\sqrt{\bar{\alpha}_{t-1}}\beta_t}{1-\bar{\alpha}_t}\,x_0.
$$

#### Posterior variance

$$
\tilde{\beta}_t=\frac{1-\bar{\alpha}_{t-1}}{1-\bar{\alpha}_t}\,\beta_t.
$$

---

#### 4) Step 4: Simplification (KL → MSE)

#### 4A) KL between Gaussians becomes (mostly) squared error between means

The denoising term is:

$$
L_{t-1}
=
D_{KL}\left(q(x_{t-1}\mid x_t,x_0)\ \|\ p_\theta(x_{t-1}\mid x_t)\right).
$$

We already derived:

$$
q(x_{t-1}\mid x_t,x_0)=\mathcal{N}(\tilde{\mu}_t(x_t,x_0),\,\tilde{\beta}_t I).
$$

Now choose the model distribution (for the “simple” derivation) with the same fixed variance:

$$
p_\theta(x_{t-1}\mid x_t)=\mathcal{N}(\mu_\theta(x_t,t),\,\tilde{\beta}_t I).
$$

If two Gaussians have the same covariance, their KL reduces to a quadratic form in the mean difference:

$$
D_{KL}\left(\mathcal{N}(\mu_1,\Sigma)\ \|\ \mathcal{N}(\mu_2,\Sigma)\right)
=
\frac{1}{2}(\mu_2-\mu_1)^\top \Sigma^{-1}(\mu_2-\mu_1).
$$

Since here $\Sigma=\tilde{\beta}_t I$, this becomes:

$$
D_{KL}
=
\frac{1}{2\tilde{\beta}_t}\left\|\tilde{\mu}_t(x_t,x_0)-\mu_\theta(x_t,t)\right\|^2.
$$

So (up to a known time-dependent weight), we replace:

$$
D_{KL}\ \longrightarrow\ \left\|\tilde{\mu}_t(x_t,x_0)-\mu_\theta(x_t,t)\right\|^2.
$$

This gives the mean-matching objective:

$$
L_{\text{simple}}(x_0)
=
\sum_{t=1}^{T}
\mathbb{E}_{q(x_t\mid x_0)}
\Big[\left\|\mu_\theta(x_t,t)-\tilde{\mu}_t(x_t,x_0)\right\|^2\Big].
$$

#### 4B) Substitute $x_0$ using the jump formula

From:

$$
x_t=\sqrt{\bar{\alpha}_t}\,x_0+\sqrt{1-\bar{\alpha}_t}\,\epsilon
$$

solve:

$$
x_0=\frac{1}{\sqrt{\bar{\alpha}_t}}\left(x_t-\sqrt{1-\bar{\alpha}_t}\,\epsilon\right).
$$

Plugging this into $\tilde{\mu}_t$ simplifies to:

$$
\tilde{\mu}_t
=
\frac{1}{\sqrt{\alpha_t}}
\left(
x_t-\frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}}\,\epsilon
\right).
$$

#### 4C) Parameterize the model mean via predicted noise

Define:

$$
\mu_\theta(x_t,t)
=
\frac{1}{\sqrt{\alpha_t}}
\left(
x_t-\frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}}\,\epsilon_\theta(x_t,t)
\right).
$$

#### 4D) Final collapse: mean MSE → noise MSE

Subtract the two means:

$$
\mu_\theta(x_t,t)-\tilde{\mu}_t
=
\frac{1}{\sqrt{\alpha_t}}
\left(
x_t-x_t
-\frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}}(\epsilon_\theta(x_t,t)-\epsilon)
\right).
$$

So the loss is proportional to $\|\epsilon-\epsilon_\theta\|^2$, and dropping the known constant yields:

$$
L_{\text{simple}}
=
\mathbb{E}_{t,x_0,\epsilon}\left[\left\|\epsilon-\epsilon_\theta(x_t,t)\right\|^2\right].
$$

---

### Key Takeaway

$$
\mathcal{L}_{\mathrm{vlb}}
=
\mathbb{E}_q\Big[
\underbrace{D_{KL}(q(x_T\mid x_0)\,\|\,p(x_T))}_{L_T}
+
\sum_{t=2}^{T}
\underbrace{D_{KL}(q(x_{t-1}\mid x_t,x_0)\,\|\,p_\theta(x_{t-1}\mid x_t))}_{L_{t-1}}
+
\underbrace{-\log p_\theta(x_0\mid x_1)}_{L_0}
\Big]
$$

becomes

$$
L_{\text{simple}}(x_0)
=
\sum_{t=1}^{T}
\mathbb{E}_{q(x_t\mid x_0)}
\Big[\left\|\mu_\theta(x_t,t)-\tilde{\mu}_t(x_t,x_0)\right\|^2\Big]
\;\Rightarrow\;
L_{\text{simple}}
=
\mathbb{E}_{t,x_0,\epsilon}\left[\left\|\epsilon-\epsilon_\theta(x_t,t)\right\|^2\right].
$$

---

### Variational Inference, ELBO, and KL (Minimum Review)

This is the minimum latent-variable / ELBO / KL toolkit that tends to show up when diffusion is used _inside_ a larger probabilistic model (e.g., as a learned prior over continuous latents).

---

#### A) Latent-variable models: why likelihood is hard

Assume a generative story:

1. Sample latent variable $x \sim p_\theta(x)$.
2. Generate observed data $w \sim p_\theta(w\mid x)$.

Then:

$$
p_\theta(w)=\int p_\theta(w\mid x)\,p_\theta(x)\,dx,
\qquad
\log p_\theta(w)\ \text{is what we want to maximize.}
$$

The issue is the integral over $x$.

---

#### B) The “cheat code”: introduce an approximate posterior $q_\phi(x\mid w)$

Define a tractable distribution:

$$
q_\phi(x\mid w)\approx p_\theta(x\mid w),
$$

where $p_\theta(x\mid w)$ is the true posterior (“what latent $x$ could have produced $w$?”).

Mindset:

- $p_\theta$ is the **generative model** (how the world produces data).
- $q_\phi$ is the **inference model** (a helper we introduce so training becomes tractable).

---

#### C) Deriving the ELBO (one inequality to remember)

Start with:

$$
\log p_\theta(w)=\log \int p_\theta(w,x)\,dx.
$$

Insert $q_\phi(x\mid w)$ by multiplying and dividing:

$$
\log p_\theta(w)
=
\log \int q_\phi(x\mid w)\,\frac{p_\theta(w,x)}{q_\phi(x\mid w)}\,dx
=
\log \mathbb{E}_{q_\phi(x\mid w)}\!\left[\frac{p_\theta(w,x)}{q_\phi(x\mid w)}\right].
$$

Apply Jensen’s inequality (log is concave):

$$
\log \mathbb{E}[Z] \ge \mathbb{E}[\log Z].
$$

So:

$$
\log p_\theta(w)
\ge
\mathbb{E}_{q_\phi(x\mid w)}\!\left[\log p_\theta(w,x)-\log q_\phi(x\mid w)\right].
$$

Define the RHS as the **ELBO**:

$$
\mathrm{ELBO}(w)
=
\mathbb{E}_{q_\phi(x\mid w)}\!\left[\log p_\theta(w,x)-\log q_\phi(x\mid w)\right].
$$

Split the joint:

$$
\log p_\theta(w,x)=\log p_\theta(w\mid x)+\log p_\theta(x),
$$

giving:

$$
\mathrm{ELBO}(w)
=
\mathbb{E}_{q_\phi(x\mid w)}[\log p_\theta(w\mid x)]
+
\mathbb{E}_{q_\phi(x\mid w)}[\log p_\theta(x)]
-
\mathbb{E}_{q_\phi(x\mid w)}[\log q_\phi(x\mid w)].
$$

Equivalently:

$$
\mathrm{ELBO}(w)
=
\mathbb{E}_{q_\phi(x\mid w)}[\log p_\theta(w\mid x)]
-
D_{\mathrm{KL}}\!\left(q_\phi(x\mid w)\,\|\,p_\theta(x)\right).
$$

---

#### D) Negative ELBO as a loss: the “three-term” view

In practice we minimize $-\mathrm{ELBO}(w)$. Expanding the KL gives:

$$
-\mathrm{ELBO}(w)
=
\mathbb{E}_{q_\phi(x\mid w)}
\Big[
-\log p_\theta(w\mid x)
+\log q_\phi(x\mid w)
-\log p_\theta(x)
\Big].
$$

This “pattern” is worth memorizing.

#### Term 1: $-\log p_\theta(w\mid x)$ is the reconstruction / negative log-likelihood

If $p_\theta(w\mid x)$ assigns high probability to the true $w$, the loss is small.

For discrete sequences, decoders often factorize:

$$
p_\theta(w\mid x)=\prod_{i=1}^n p_\theta(w_i\mid x),
$$

so:

$$
-\log p_\theta(w\mid x)=\sum_{i=1}^n -\log p_\theta(w_i\mid x),
$$

which is exactly **cross-entropy** (reconstruction loss for tokens).

#### Term 2–3 together form a KL penalty

$$
\mathbb{E}_{q_\phi(x\mid w)}\left[\log q_\phi(x\mid w)-\log p_\theta(x)\right]
=
D_{\mathrm{KL}}(q_\phi(x\mid w)\|p_\theta(x)).
$$

Intuition: keep the latent codes used during training “compatible” with the prior used at sampling time.

#### Why the expectation matters

We don’t observe the “true” latent $x$. The expectation means we:

- sample plausible $x\sim q_\phi(x\mid w)$,
- score reconstruction + regularization under those samples,
- and optimize the average.

---

#### E) KL intuition (coin story): KL as per-sample log-likelihood gap

Think of KL as: how much worse it is (in average log-likelihood per sample) to explain data from a “true” distribution $P$ using an alternative distribution $Q$.

Let $P$ and $Q$ be two biased coins:

- Coin $P$: heads probability $p_1$, tails probability $p_2 = 1-p_1$.
- Coin $Q$: heads probability $q_1$, tails probability $q_2 = 1-q_1$.

Flip the **true coin $P$** a total of $N$ times. Let $N_H$ be heads and $N_T=N-N_H$ be tails.

#### (a) Likelihood of the observed data under each coin

$$
P(\text{data}\mid P) = p_1^{N_H} p_2^{N_T},
\quad
P(\text{data}\mid Q) = q_1^{N_H} q_2^{N_T}.
$$

#### (b) Log-likelihood ratio (“how much better is $P$ than $Q$ on this data?”)

$$
\log \frac{P(\text{data}\mid P)}{P(\text{data}\mid Q)}
= N_H \log \frac{p_1}{q_1} + N_T \log \frac{p_2}{q_2}.
$$

Divide by $N$:

$$
\frac{1}{N}\log \frac{P(\text{data}\mid P)}{P(\text{data}\mid Q)}
= \frac{N_H}{N}\log \frac{p_1}{q_1} + \frac{N_T}{N}\log \frac{p_2}{q_2}.
$$

#### (c) Large-sample limit → KL divergence

By the law of large numbers, $\tfrac{N_H}{N}\to p_1$ and $\tfrac{N_T}{N}\to p_2$. Thus:

$$
\lim_{N\to\infty}\frac{1}{N}\log \frac{P(\text{data}\mid P)}{P(\text{data}\mid Q)}
= p_1 \log \frac{p_1}{q_1} + p_2 \log \frac{p_2}{q_2}.
$$

This is exactly:

$$
D_{\mathrm{KL}}(P\|Q) = \sum_{i\in\{0,1\}} p_i \log \frac{p_i}{q_i}.
$$

**Interpretation:** $D_{\mathrm{KL}}(P\|Q)$ is the asymptotic (per-sample) log-likelihood advantage of using the true distribution $P$ over $Q$ on data generated from $P$.

---

#### F) A note for learned priors

Sometimes the prior $p_\theta(x)$ is not a simple distribution (like $\mathcal{N}(0,I)$), but is defined by a learned generative process (e.g., an iterative denoising chain). In that case, the term $-\log p_\theta(x)$ is handled using the training objective that comes with that generative process (often itself derived from a variational bound).

---

#### Key references

- DDPM: https://arxiv.org/abs/2006.11239
- Diffusion-LM: https://arxiv.org/pdf/2205.14217
- KL Intuition: https://www.youtube.com/watch?v=SxGYPqCgJWM
