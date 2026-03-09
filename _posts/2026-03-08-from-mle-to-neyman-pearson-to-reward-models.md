---
layout: post
title: "From MLE to Neyman-Pearson to Reward Models"
date: 2026-03-08
description: "A broad roadmap of statistical inference, inspired by Data 145, and a short bridge to modern reward-based AI."
tags: [statistics, ml, notes]
categories: [technical-blogs]
featured: false
show_on_homepage: false
math: true
---

This post is an attempt to explain the arc of a mathematical statistics course in a way that still feels useful **outside** the course itself.

It is inspired by the first half of Data 145, but I am rewriting it for a broader audience: someone who wants to understand how ideas like **MLE**, **Fisher information**, **bootstrap**, and **Neyman-Pearson** actually connect.

The goal is not to reproduce every proof or every computational detail from lecture. The goal is to keep the **main flow**, the **core formulas**, and the **conceptual turns** that make the subject hang together.

At the end, I also add a short bridge to **reward-based post-training in modern AI**, because some of the same ideas reappear there in a different vocabulary: KL penalties, proxy objectives, and exploitation of imperfect rewards.

---

## 1. The big picture of the course

The course has a very clean progression once the lectures are connected.

1. Start with a real statistical question.
   We want to estimate something meaningful from data, not just compute a formula in the abstract.

2. Use a model to reduce complexity.
   In Lecture 1, the Poisson process turns a hard "full distribution" problem into a one-parameter problem.

3. Estimate the parameter.
   This naturally leads to maximum likelihood estimation (MLE).

4. Ask what the estimator does across repeated samples.
   Is it consistent? Approximately normal? Efficient?

5. Build general tools for that analysis.
   This is where convergence in distribution, Slutsky, and the delta method come in.

6. Generalize from one example to a full theory of estimation.
   Statistical models, plug-in estimators, score functions, Fisher information, asymptotic normality, Cramer-Rao.

7. Then complicate the story on purpose.
   MLE is not always the best estimator under the criterion we care about. This leads to decision theory, shrinkage, admissibility, and Bayes estimators.

8. Then complicate it again.
   Priors are not directly checkable. Models may be misspecified. Variances may be hard to compute analytically. This motivates objective Bayes, robust variance ideas, and bootstrap methods.

9. Finally, shift from estimation to testing.
   First test whole distributions using KS. Then move to the formal hypothesis testing framework and Neyman-Pearson theory.

In one line, the arc goes from a **real question**, to a **model**, to an **estimator**, to its **sampling distribution**, then to **comparing estimators**, then to **Bayes / robustness / bootstrap**, then to **goodness of fit**, and finally to **hypothesis testing**.

---

## 2. What I am intentionally leaving in the background

There are a few topics I am deliberately not expanding in detail here:

- minimax calculations
- hierarchical Bayes and Gibbs sampling details
- the exact sandwich variance formula under misspecification
- randomized tests in discrete Neyman-Pearson settings

These ideas matter, but they are not the core of the story I want this post to tell.

What I do want to keep is **why** they appear:

- minimax because "best" depends on the comparison criterion
- hierarchical Bayes because priors can themselves be learned
- sandwich variance because wrong models change uncertainty calculations
- randomized tests because exact level constraints can be awkward in discrete spaces

---

## 3. Lecture 1: the motivating story

Lecture 1 is not just an intro lecture. It quietly sets up almost the whole first half of the course.

### The question

How likely is a significant earthquake in California within the next 7 days?

The key modeling step is to look at **interarrival times** between earthquakes.

### The model

The lecture argues that:

- the interarrival histogram looks right-skewed, like an exponential distribution
- the cumulative count over time is roughly linear, suggesting a roughly constant event rate

That motivates a **homogeneous Poisson process** with rate $\lambda$.

If the process is Poisson with rate $\lambda$, then the interarrival times

$$
X_1, X_2, \dots, X_n
$$

are i.i.d. exponential$(\lambda)$.

### Why this matters

This is the first big modeling lesson:

> A good parametric model can reduce an infinite-dimensional problem to a finite-dimensional one.

Instead of estimating the whole waiting-time distribution directly, we estimate a single parameter $\lambda$.

### MLE appears immediately

For i.i.d. exponential$(\lambda)$ data, the MLE is

$$
\hat\lambda_{MLE} = \frac{1}{\bar X_n}.
$$

This is already interesting because it is **not** just a sample mean. It is a **nonlinear function** of a sample mean.

### The probability we actually care about

If $X \sim \text{Exponential}(\lambda)$, then

$$
\mathbb{P}(X \le 7) = 1 - e^{-7\lambda}.
$$

So the MLE-based plug-in estimator is

$$
\hat p_{MLE} = 1 - e^{-7\hat\lambda}.
$$

The lecture also compares this to a more direct empirical estimator based on the proportion of observed waits below 7 days.

### The key lesson

Both estimators are approximately Gaussian, but the MLE-based estimator has **lower variance** if the model is right.

This is the first major payoff of parametric statistics:

> If the model is reasonable, structure can buy you efficiency.

### Why this lecture leads directly to Lecture 2

The lecture asks:

- Why is $\hat\lambda = 1/\bar X_n$ approximately normal?
- More generally, why should a smooth function of an approximately normal quantity still be approximately normal?

That is exactly the setup for the **delta method**.

### Key takeaways from Lecture 1

- Poisson process $\Rightarrow$ exponential interarrival times
- why the earthquake story motivates a parametric model
- $\hat\lambda_{MLE} = 1/\bar X_n$
- plug-in estimation of $1 - e^{-7\lambda}$
- why Lecture 1 motivates CLT + delta method rather than proving them

---

## 4. Lecture 2: convergence and the delta method

Lecture 2 is the mathematical bridge that turns Lecture 1's intuition into something usable.

### The main objects

The lecture reviews:

- convergence in distribution
- convergence in probability
- continuous mapping
- Slutsky's theorem
- delta method

### The delta method

The version to remember is:

If

$$
\sqrt{n}(Y_n - \theta) \xrightarrow{d} N(0,\sigma^2)
$$

and $g$ is differentiable with $g'(\theta) \neq 0$, then

$$
\sqrt{n}(g(Y_n) - g(\theta))
\xrightarrow{d}
N\left(0, (g'(\theta))^2 \sigma^2\right).
$$

### Why it matters

This is one of the core moves of the class:

> Once I understand the asymptotic distribution of an estimator $\hat\theta$, I also understand the asymptotic distribution of smooth functions $g(\hat\theta)$.

That matters all over the place:

- Lecture 1: $\hat\lambda = 1/\bar X_n$
- plug-in estimators in Lecture 3
- transformed parameters and probabilities later on

### Intuition

The reason it works is local linearization:

$$
g(Y_n) \approx g(\theta) + g'(\theta)(Y_n - \theta).
$$

So asymptotically, $g(Y_n)$ behaves like a constant plus a scaled version of $Y_n$.

### Key takeaways from Lecture 2

- the difference between convergence in distribution and convergence in probability
- what continuous mapping and Slutsky let me do
- the exact statement of the delta method
- how to use the delta method to move from $\hat\theta$ to $g(\hat\theta)$

---

## 5. Lecture 3: models, estimators, likelihood

Lecture 3 zooms out. Instead of focusing on one earthquake example, it builds the general language of statistics.

### Probability vs. statistics

The course keeps emphasizing this switch:

- **probability:** distribution known, study random outcomes
- **statistics:** data observed, distribution unknown, infer structure

That shift in perspective drives everything else.

### Parametric vs. nonparametric

A **parametric model** assumes the data come from a family

$$
f_\theta, \quad \theta \in \Theta,
$$

where $\theta$ is finite-dimensional.

A **nonparametric model** does not assume a fixed finite-dimensional form.

This distinction becomes important again later:

- parametric MLE theory
- nonparametric bootstrap
- KS testing of full distributions

### Estimators, consistency, asymptotic normality

Lecture 3 sets up the three recurring estimator questions:

1. Is the estimator close to the truth for large $n$?
2. What is its approximate sampling distribution?
3. What happens if I transform it?

That leads to:

- consistency
- asymptotic normality
- plug-in estimators
- delta method for transformed estimators

### Plug-in estimation

If I care about $g(\theta)$, the natural estimator is

$$
g(\hat\theta).
$$

This is simple but conceptually huge. A lot of the course can be summarized as:

1. analyze $\hat\theta$
2. transfer that result to $g(\hat\theta)$

### Likelihood and why MLE makes sense

For i.i.d. data, the likelihood is

$$
\text{Lik}(\theta;X) = \prod_{i=1}^n f_\theta(X_i),
$$

and the log-likelihood is

$$
\ell_n(\theta;X) = \sum_{i=1}^n \log f_\theta(X_i).
$$

The MLE is the $\theta$ that maximizes this.

### Consistency of the MLE

The lecture's main idea is:

- by the law of large numbers,

$$
\frac{1}{n}\ell_n(\theta) \approx \mathbb{E}_{\theta_0}[\log f_\theta(X)]
$$

- the expected log-likelihood is maximized at the true parameter $\theta_0$
- so the empirical maximizer should be near the true maximizer for large $n$

This gives the heuristic for MLE consistency.

### Score function

The score is the derivative of the log-likelihood:

$$
S_n(\theta) = \ell_n'(\theta).
$$

At the true parameter, its expectation is zero:

$$
\mathbb{E}_{\theta_0}[S_n(\theta_0)] = 0.
$$

This makes the score look like a centered random fluctuation around the truth, which is exactly why it later enters asymptotic normality.

### Fisher information

For one observation,

$$
I(\theta)
=
\operatorname{Var}_\theta(\ell_1'(\theta;X))
=
\mathbb{E}_\theta[(\ell_1'(\theta;X))^2]
=
-\mathbb{E}_\theta[\ell_1''(\theta;X)].
$$

This identity is central.

Interpretation:

- large information means the likelihood is sharply curved around its maximum
- sharp curvature means the parameter is estimated more precisely

### Key takeaways from Lecture 3

- what a statistical model is
- parametric vs. nonparametric
- what plug-in estimation is
- why MLE consistency comes from expected log-likelihood
- score function and why its mean is zero
- Fisher information and its three equivalent forms

---

## 6. Lectures 4 and 5: asymptotic normality and efficiency of the MLE

This is where the course formalizes what it had been previewing since Lecture 1.

### The main theorem

Under regularity conditions,

$$
\sqrt{n}(\hat\theta_{MLE} - \theta_0)
\xrightarrow{d}
N\left(0,\frac{1}{I(\theta_0)}\right).
$$

Equivalently, for large $n$,

$$
\hat\theta_{MLE}
\approx
N\left(\theta_0,\frac{1}{nI(\theta_0)}\right).
$$

This is one of the most important formulas in the course.

### How the derivation works

The logic is worth remembering even if I do not re-prove every step:

1. The MLE solves the score equation

$$
S_n(\hat\theta) = 0.
$$

2. Taylor expand around the truth:

$$
0 \approx S_n(\theta_0) + (\hat\theta - \theta_0)S_n'(\tilde\theta)
$$

for some intermediate $\tilde\theta$.

3. Rearranging gives

$$
\hat\theta - \theta_0
\approx
-\frac{S_n(\theta_0)}{S_n'(\tilde\theta)}.
$$

4. The numerator is a sum of mean-zero i.i.d. terms, so the CLT applies.

5. The denominator behaves like $-nI(\theta_0)$ by the law of large numbers and regularity.

6. Slutsky then gives the asymptotic normal limit.

This is the deepest connection in the first half of the course:

> CLT + Taylor expansion + Fisher information = asymptotic distribution of the MLE.

### Approximate inference from the theorem

For large $n$, the standard error of the MLE is approximately

$$
\operatorname{SE}(\hat\theta_{MLE})
\approx
\sqrt{\frac{1}{nI(\theta_0)}}.
$$

Since $\theta_0$ is unknown, we usually plug in $\hat\theta$:

$$
\operatorname{SE}(\hat\theta_{MLE})
\approx
\sqrt{\frac{1}{nI(\hat\theta)}}.
$$

This is the frequentist route to approximate confidence intervals.

### Efficiency and Cramer-Rao

Lecture 5 then asks a natural question:

> Even if the MLE is good, could some other estimator have smaller variance?

The benchmark result is the Cramer-Rao lower bound:

$$
\operatorname{Var}_\theta(T) \ge \frac{1}{nI(\theta)}
$$

for unbiased estimators $T$.

So if an unbiased estimator reaches this bound, it is efficient.

### The nuance I do not want to forget

This part is easy to overstate.

- The Cramer-Rao bound is a statement about **unbiased** estimators.
- The MLE is **asymptotically efficient** under regularity.
- That does **not** mean every finite-sample MLE is literally unbiased and best in every possible sense.

Lecture 6 exists precisely because this stronger statement is false.

### Key takeaways from Lectures 4-5

- the asymptotic normality formula for the MLE
- the logic of the proof through the score Taylor expansion
- why Fisher information determines asymptotic variance
- the Cramer-Rao bound
- the meaning of "efficient" and "asymptotically efficient"

---

## 7. Lecture 6: decision theory, shrinkage, admissibility

Lecture 6 is the course's first deliberate correction to the idea that "MLE is always the answer."

### The central message

MLE is excellent in many settings, but:

> the "best" estimator depends on the loss function and the criterion used to compare estimators.

### Loss and risk

This lecture introduces:

- **loss** $L(\theta,a)$: how bad action $a$ is when the truth is $\theta$
- **risk** $R(\theta;T)$: expected loss of estimator $T$

Under squared error loss,

$$
R(\theta;T) = \mathbb{E}_\theta[(T-\theta)^2] = \operatorname{MSE}_\theta(T).
$$

And the bias-variance decomposition says

$$
\operatorname{MSE} = \operatorname{Var} + \text{Bias}^2.
$$

### The coin flip example

For $X \sim \text{Binomial}(n,p)$:

- MLE: $\hat p = X/n$
- Laplace shrinkage estimators:

$$
\tilde p_1 = \frac{X+1}{n+2}, \qquad
\tilde p_2 = \frac{X+2}{n+4}
$$

These shrink toward $1/2$.

### Why shrinkage can help

The MLE is unbiased, but the Laplace estimators deliberately add bias.

Why would that ever help?

Because reducing variance can be worth more than the bias cost, especially when the true $p$ is near $1/2$.

This is the bias-variance tradeoff in a clean, concrete form.

### The bootstrap point-estimator caution

Lecture 6 also studies a very specific "bootstrap estimator":

- resample many bootstrap datasets
- compute the MLE each time
- average those bootstrap MLEs

This is **not** the same as bootstrap confidence intervals in Lecture 10.

The point of Lecture 6 is:

> averaging bootstrap point estimates does not improve the original estimator.

In the Bernoulli example, the bootstrap estimator has:

- the same bias as the MLE
- **higher** variance
- therefore strictly higher MSE

So it is inadmissible.

### Admissibility

An estimator is inadmissible if another estimator has:

- no larger risk everywhere
- strictly smaller risk somewhere

The bootstrap point estimator is inadmissible because the MLE dominates it.

### How do we choose among admissible estimators?

The lecture gives two ways:

1. restrict to a class, such as unbiased estimators
2. summarize the full risk curve by a single target

Examples of the second idea:

- average risk
- worst-case risk

For the broader story of the course, the **average-risk / Bayes** direction is the one to remember most.

### Bayes estimator appears naturally

If I put a prior on $p$, then minimizing posterior expected squared error gives

$$
T^*(X) = \mathbb{E}[p \mid X].
$$

This is the Bayes estimator under squared error loss.

So Bayesian estimation does not just appear philosophically in Lecture 7. It is already motivated in Lecture 6 as an optimization answer to a decision problem.

### Key takeaways from Lecture 6

- loss, risk, MSE, bias-variance decomposition
- why unbiased is not the same as best under MSE
- why shrinkage can beat the MLE in some regions
- why the bootstrap point estimator is worse
- admissibility as a minimal requirement
- Bayes estimator under squared error is posterior mean

### What I leave in the background from Lecture 6

- worst-case risk / minimax calculations

---

## 8. Lecture 7: Bayesian inference proper

Lecture 7 turns the decision-theory motivation into full Bayesian inference.

### The basic identity

The posterior is

$$
\pi(\theta \mid x) \propto f_\theta(x)\pi(\theta).
$$

That is:

$$
\text{posterior} \propto \text{likelihood} \times \text{prior}.
$$

### Conjugate families

The lecture focuses on three standard families:

- **Beta-Binomial**
- **Gamma-Exponential**
- **Normal-Normal**

These are worth remembering because they show the same pattern over and over:

1. choose a prior from a convenient family
2. multiply by the likelihood
3. posterior stays in the same family
4. posterior mean becomes a weighted average of prior information and data

For example, in the Beta-Binomial setup,

$$
p \sim \text{Beta}(\alpha,\beta),
\qquad
X \mid p \sim \text{Binomial}(n,p),
$$

and the posterior is

$$
p \mid X \sim \text{Beta}(X+\alpha, n-X+\beta).
$$

### Posterior mean as weighted average

This is one of the main conceptual takeaways.

The posterior mean combines:

- what the prior says
- what the data say

This formalizes the shrinkage intuition from Lecture 6.

### "The likelihood is all that matters"

More precisely:

> once the prior is fixed, the data enter the posterior only through the likelihood

and often only through a sufficient statistic.

This is why likelihood-based summaries remain central even in Bayesian inference.

### Large-sample behavior: the prior washes out

Lecture 7 also gives the key asymptotic message:

for large $n$, the posterior is approximately normal around the MLE:

$$
\pi(\theta \mid X)
\approx
N\left(\hat\theta_{MLE}, \frac{1}{nI(\hat\theta_{MLE})}\right).
$$

This is the Bernstein-von Mises phenomenon, stated informally in lecture.

So for large samples:

- Bayesian credible intervals
- frequentist asymptotic confidence intervals

become very close.

### Key takeaways from Lecture 7

- posterior proportional to likelihood times prior
- conjugate priors in the three main examples
- posterior mean as the Bayes estimator under squared error
- likelihood as the key data summary
- prior washes out for large $n$
- why Bayesian and frequentist intervals start to agree asymptotically

---

## 9. Lecture 8: where priors come from

Lecture 8 is less about calculation and more about interpretation and prior choice.

### The warning

Unlike the likelihood model, the prior is typically **uncheckable** from data.

That is a serious point, not just a philosophical aside.

If the prior is strong and the sample size is not large, the prior can materially affect the conclusion.

### Four ways priors arise in the lecture

1. **Subjective Bayes**
   - prior as personal degree of belief

2. **Objective Bayes**
   - flat priors
   - Jeffreys prior

3. **Convenience priors**
   - often conjugate priors chosen for tractability

4. **Hierarchical Bayes**
   - use data from related groups to learn prior structure

For the conceptual arc of this post, the first three matter more than the last.

### Jeffreys prior

The headline formula is

$$
\pi_J(\theta) \propto \sqrt{I(\theta)}.
$$

Why it matters:

- a flat prior is not invariant under reparameterization
- Jeffreys prior is designed to fix that problem

So when I change coordinates, Jeffreys behaves in a principled way whereas a naive "uniform prior" may not.

### Key takeaways from Lecture 8

- priors are uncheckable
- flat priors are not automatically neutral
- Jeffreys prior is based on $\sqrt{I(\theta)}$
- the distinction between subjective, objective, and convenience priors

### What I leave in the background from Lecture 8

- hierarchical Bayes details
- Gibbs sampler details

---

## 10. Lecture 9: what if the model is wrong?

This lecture is conceptually important because it fixes a hidden assumption in all the earlier MLE theory.

### The hidden assumption

Earlier lectures assumed the model family $f_\theta$ actually contains the truth.

Lecture 9 asks:

> what if the true distribution is $g$, and $g$ is not in the model family?

### KL divergence

The key object is

$$
D_{KL}(g \,\|\, f_\theta)
=
\mathbb{E}_g\left[\log \frac{g(X)}{f_\theta(X)}\right].
$$

### The main message

When the model is misspecified, the MLE does not converge to a "true parameter" inside the family, because there may not be one.

Instead, it converges to the pseudo-true value

$$
\theta^* = \arg\min_\theta D_{KL}(g \,\|\, f_\theta).
$$

So the MLE is still doing something meaningful:

> it picks the member of the wrong family that is closest to the truth in KL divergence.

### Why the usual variance formula breaks

If the model is wrong, then the old Fisher-information variance formula no longer automatically applies.

That is why the lecture introduces the **sandwich** idea:

- the center still comes from a Taylor expansion around the pseudo-true value
- but the variance now uses quantities under the true distribution $g$, not just the parametric model

I do not need the exact formula here, but I do want to remember:

> misspecification changes the asymptotic variance, so a robust correction is needed.

### Key takeaways from Lecture 9

- what misspecification means
- what KL divergence measures
- why the misspecified MLE targets the KL projection $\theta^*$
- why the old MLE variance formula may fail under misspecification
- why a sandwich-style correction is introduced

---

## 11. Lecture 10: bootstrap for uncertainty

Lecture 10 returns to the bootstrap, but now in the correct role: **estimating uncertainty**, not improving a point estimator.

### Parametric bootstrap

Use this when I trust a parametric family.

Typical pattern:

1. fit the model and get $\hat\theta$
2. simulate new samples from $f_{\hat\theta}$
3. recompute the statistic each time
4. use the bootstrap distribution to estimate standard error or a confidence interval

### Nonparametric bootstrap

Use this when I do **not** want to assume a parametric family.

Then I treat the empirical cdf $F_n$ as a stand-in for the population distribution and resample from it.

### Three confidence interval methods in the lecture

#### 1. Normal interval

Estimate the bootstrap standard error and use

$$
T \pm z_{\alpha/2}\widehat{se}_T.
$$

Good when the estimator is approximately normal and roughly centered at the parameter.

#### 2. Percentile interval

Take the lower and upper quantiles of the bootstrap distribution of the estimator itself.

Good:

- simple
- easy to implement

Weakness:

- can behave badly if the estimator is biased

#### 3. Basic / empirical bootstrap interval

This uses the bootstrap distribution of the **error**

$$
\delta = \hat\theta - \theta
$$

rather than the distribution of $\hat\theta$ directly.

The main conceptual point:

- percentile interval works directly with bootstrap estimates
- basic bootstrap recenters around the original estimate and has better bias behavior

### The main lesson

Lecture 10 complements Lecture 6 perfectly:

- Lecture 6: bootstrap averaging does **not** improve point estimation
- Lecture 10: bootstrap is very useful for approximating **sampling distributions, standard errors, and confidence intervals**

### Key takeaways from Lecture 10

- parametric vs. nonparametric bootstrap
- when each is appropriate
- normal vs. percentile vs. basic bootstrap intervals
- the main pros and cons of the three interval methods

---

## 12. Lecture 11: empirical CDF and KS tests

This lecture shifts attention from estimating parameters to checking entire distributions.

### The empirical CDF

For data $X_1,\dots,X_n$, the empirical CDF is

$$
F_n(x) = \frac{1}{n}\sum_{i=1}^n I(X_i \le x).
$$

It is the natural nonparametric summary of the sample distribution.

### KS statistic

For testing whether the data come from a fully specified continuous CDF $F$,

$$
D_n = \sup_x |F_n(x) - F(x)|.
$$

This is the Kolmogorov-Smirnov statistic.

Interpretation:

> it measures the largest vertical gap between the empirical CDF and the hypothesized CDF.

### Why KS is nice

Under a fully specified continuous null, the null distribution of $D_n$ is **distribution-free**.

That is a major fact. The lecture shows this by transforming through the null CDF to Uniform$(0,1)$.

So under the null, the problem effectively reduces to

$$
\sup_{0 \le u \le 1} |G_n(u) - u|
$$

for an empirical CDF $G_n$ of uniforms.

### Unknown-parameter case

If the null is not fully specified, for example

$$
H_0: F_X = F_\theta
$$

with unknown $\theta$, then the old distribution-free KS null no longer applies.

The lecture's fix is:

1. estimate $\theta$ by $\hat\theta$
2. compute the KS distance from $F_{\hat\theta}$
3. estimate the null distribution by **parametric bootstrap**

This is a beautiful connection back to Lecture 10.

### Two-sample KS

If I have two independent samples with empirical CDFs $F_n$ and $G_m$, then

$$
D_{n,m} = \sup_x |F_n(x) - G_m(x)|
$$

tests whether the two samples come from the same continuous distribution.

### Key takeaways from Lecture 11

- definition of the empirical CDF
- definition and interpretation of the KS statistic
- why the fully specified continuous-null case is distribution-free
- why the unknown-parameter case is different
- why parametric bootstrap is used there
- the two-sample KS setup

---

## 13. Lectures 12 and 13: hypothesis testing and Neyman-Pearson

These lectures shift from "estimate the unknown" to "decide whether to reject a null hypothesis."

### Core testing language

I want to be fluent with:

- null and alternative hypotheses
- type I error
- type II error
- level $\alpha$
- power

The power function is the probability of rejection as a function of the parameter.

### The main problem setup

Lecture 12 emphasizes that hypothesis testing problems vary a lot:

- one-sample $z$-test
- $t$-test with nuisance parameter
- Fisher exact test
- permutation test

But before tackling all of those, the course solves the cleanest case first:

> simple null vs. simple alternative

### Likelihood ratio test

If the null and alternative have densities $f_0$ and $f_1$, define

$$
\operatorname{LR}(X) = \frac{f_1(X)}{f_0(X)}.
$$

The likelihood ratio test rejects for large LR.

### Neyman-Pearson lemma

This is one of the major theorems to know.

It says:

> among all level-$\alpha$ tests for a simple null versus a simple alternative, the likelihood ratio test has the greatest power.

The lecture gives the intuition as "bang for buck":

- bang = power gained under $H_1$
- buck = type I error spent under $H_0$
- ratio = $f_1/f_0$

So we should spend our rejection budget on sample points with the largest likelihood ratio.

That is a very memorable way to think about the theorem.

### Why the Benford example matters

Lecture 12 compares TV, KS, and the LRT in a Benford-vs-Uniform example.

The lesson is:

- if the alternative is specifically known, the LRT is best by NP
- omnibus tests like TV or KS are useful when the alternative is not fully specified

So the "best test" depends on how much structure I am willing to assume.

### Lecture 13: beyond simple vs. simple

Lecture 13 generalizes the picture.

#### UMP tests

For one-sided alternatives in families with **monotone likelihood ratio (MLR)**, there can be a uniformly most powerful (UMP) test.

That means one test beats all competitors at every parameter value in the alternative.

This is the clean case where optimality extends beyond simple-vs-simple.

#### Two-sided alternatives

For two-sided alternatives, there is generally **no UMP test**.

That is a major conceptual point:

> alternatives in opposite directions create conflicting notions of power, so no single test can be best everywhere.

#### Nuisance parameters and the $t$-test

Lecture 13 also explains why the $t$-test works:

- the variance is unknown
- that variance is a nuisance parameter
- the test statistic is constructed so its null distribution no longer depends on the nuisance parameter

This is the pivotal-quantity idea.

### Key takeaways from Lectures 12-13

- type I error, type II error, level, power
- likelihood ratio test and its interpretation
- statement and intuition of the Neyman-Pearson lemma
- why LRT is optimal for simple-vs-simple
- what UMP means
- why MLR matters for one-sided alternatives
- why two-sided alternatives usually do not have a UMP test
- why the $t$-test is a nuisance-parameter solution

### What I leave in the background from Lectures 12-13

- randomized-test details

---

## 14. The most important connections between lectures

This is the section I most want to remember when the lectures start to blur together.

### Connection 1: Lecture 1 to Lecture 2

Lecture 1 gives a nonlinear estimator:

$$
\hat\lambda = \frac{1}{\bar X_n}.
$$

Lecture 2 explains why that still has an asymptotically normal distribution:

- first CLT for $\bar X_n$
- then delta method for $1/x$

### Connection 2: Lecture 2 to Lecture 3

Lecture 2 gives the generic tool:

- analyze $Y_n$
- then analyze $g(Y_n)$

Lecture 3 turns that into a statistical principle:

- analyze $\hat\theta$
- then use plug-in estimation for $g(\hat\theta)$

### Connection 3: Lecture 3 to Lectures 4-5

Lecture 3 defines:

- score
- Fisher information
- MLE consistency

Lectures 4-5 use exactly those objects to derive

$$
\sqrt{n}(\hat\theta - \theta_0)
\xrightarrow{d}
N\left(0,\frac{1}{I(\theta_0)}\right).
$$

### Connection 4: Lectures 5 to 6

After proving that MLE is asymptotically efficient, the course immediately asks:

> efficient according to which criterion?

That opens the door to loss functions, MSE, shrinkage, and admissibility.

### Connection 5: Lecture 6 to Lectures 7-8

Lecture 6 shows that minimizing average risk leads to posterior means.

Lecture 7 says: good, now let us do Bayes properly.

Lecture 8 then asks the next unavoidable question:

> where should the prior come from?

### Connection 6: Lecture 8 to Lecture 9

Lecture 8 worries that the prior is uncheckable.
Lecture 9 worries that the **model itself** may be wrong.

So the course shifts from:

- "what if the prior is questionable?"

to:

- "what if the likelihood family is questionable?"

### Connection 7: Lecture 9 to Lecture 10

Lecture 9 says analytic variance calculations may fail or become messy under misspecification.

Lecture 10 answers:

> if formulas are hard, approximate the sampling distribution by bootstrap.

### Connection 8: Lecture 10 to Lecture 11

Lecture 10 develops the empirical distribution and resampling.

Lecture 11 uses the empirical CDF itself as the main object in goodness-of-fit testing.

### Connection 9: Lecture 11 to Lectures 12-13

Lecture 11 is still about testing, but for whole distributions.

Lectures 12-13 move to the broader and more formal testing framework:

- rejection regions
- type I / type II error
- power
- optimal tests

So the course ends the first half by unifying goodness-of-fit ideas with general decision-theoretic testing language.

---

## 15. A compact checklist of formulas and ideas

If I had to compress the whole story into one compact page of formulas and claims, this is what I would keep.

### Core formulas

$$
\hat\lambda_{MLE} = \frac{1}{\bar X_n}
$$

$$
\mathbb{P}(X \le 7) = 1 - e^{-7\lambda}
$$

$$
\sqrt{n}(Y_n - \theta) \xrightarrow{d} N(0,\sigma^2)
\Rightarrow
\sqrt{n}(g(Y_n)-g(\theta)) \xrightarrow{d} N(0,(g'(\theta))^2\sigma^2)
$$

$$
S_n(\theta) = \ell_n'(\theta)
$$

$$
I(\theta)
=
\operatorname{Var}(\ell_1'(\theta;X))
=
\mathbb{E}[(\ell_1'(\theta;X))^2]
=
-\mathbb{E}[\ell_1''(\theta;X)]
$$

$$
\sqrt{n}(\hat\theta_{MLE}-\theta_0)
\xrightarrow{d}
N\left(0,\frac{1}{I(\theta_0)}\right)
$$

$$
\operatorname{Var}(T) \ge \frac{1}{nI(\theta)}
\quad
\text{for unbiased } T
$$

$$
\operatorname{MSE} = \operatorname{Var} + \text{Bias}^2
$$

$$
\pi(\theta \mid x) \propto f_\theta(x)\pi(\theta)
$$

$$
\pi_J(\theta) \propto \sqrt{I(\theta)}
$$

$$
D_{KL}(g \,\|\, f_\theta)
=
\mathbb{E}_g\left[\log\frac{g(X)}{f_\theta(X)}\right]
$$

$$
D_n = \sup_x |F_n(x)-F(x)|
$$

$$
\operatorname{LR}(X)=\frac{f_1(X)}{f_0(X)}
$$

### Core conceptual statements

- A parametric model buys efficiency if it is approximately correct.
- Delta method is how I move from $\hat\theta$ to $g(\hat\theta)$.
- MLE consistency comes from expected log-likelihood being maximized at the truth.
- Fisher information controls asymptotic precision.
- MLE is asymptotically efficient, not universally optimal in every finite-sample MSE sense.
- Shrinkage can beat unbiased estimators by trading bias for variance reduction.
- Bayes estimator under squared error is posterior mean.
- Priors are uncheckable; models may be misspecified.
- Bootstrap is for approximating uncertainty, not magically reducing it.
- KS compares whole distributions via empirical CDFs.
- Neyman-Pearson says LRT is optimal for simple-vs-simple.
- UMP can exist for one-sided MLR families, but not generally for two-sided alternatives.

---

## 16. Final summary

If I had to summarize the first half of the course in one paragraph, it would be this:

Statistical inference starts by imposing structure on data, usually through a model. Once we estimate parameters by MLE, the next job is to understand uncertainty, which leads to convergence, delta method, score functions, Fisher information, and asymptotic normality. But estimation is not just about unbiasedness or maximum likelihood: decision theory, shrinkage, Bayes estimators, and admissibility show that the criterion matters. Then the course asks what happens when assumptions weaken: priors may be hard to justify, models may be wrong, and analytic variance formulas may be unavailable, so we use objective Bayes ideas, KL-based misspecification logic, and bootstrap methods. Finally, the focus shifts from estimation to testing, first for distributions via KS and then for general hypotheses via likelihood ratios and Neyman-Pearson.

That is the arc I now see behind the course.

---

## 17. A short bridge to reward models

The title of this post ends with **reward models** on purpose.

After reading the CDSS 94 notes on RL, a few ideas felt like modern echoes of the same statistical story:

### 1. KL keeps showing up because "do better, but do not drift too far" is a general problem

In the statistics lectures, KL divergence appears when the model is misspecified: the MLE under the wrong family moves toward the KL-closest approximation to the truth.

In RLHF-style post-training, the objective often looks like

$$
\max_{\pi_\theta} \; \mathbb{E}[r(x,y)] - \beta \, KL(\pi_\theta \,\|\, \pi_{ref}).
$$

That has the same flavor: improve some target objective, but pay a penalty for moving too far from a trusted reference distribution.

### 2. Forward vs. reverse KL is not just a technical distinction

The CDSS94 notes emphasize that **who gets sampled from** matters:

- forward KL is coverage-seeking and conservative
- reverse KL is mode-seeking and sharper

That fits the broader story here too. A lot of statistical procedures differ not just by formula, but by what they encourage:

- coverage vs. concentration
- robustness vs. decisiveness
- exploration vs. exploitation

### 3. Reward models are proxy objectives, and proxy objectives can be gamed

One of the deepest themes of statistics is that we almost never optimize what we truly care about directly. We optimize a tractable stand-in:

- a model family
- a loss function
- a test statistic
- a reward model

The CDSS94 notes make this concrete with reward hacking and chattiness: if the reward model overvalues response length, the model learns length, not quality.

That is just Goodhart's law in a modern form:

> once a proxy becomes the target, the gap between proxy and reality starts to matter a lot.

### 4. Better measurement changes everything

The notes also mention process reward models, reward model ensembles, and iterative reward-model updates.

This feels statistically familiar. If the objective is lossy, one natural response is not just "optimize less," but also:

- measure better
- calibrate better
- check robustness
- change the target when it is obviously being exploited

That is not far from the logic behind better estimators, robust variance corrections, or choosing a test statistic that actually reflects the alternative you care about.

### 5. The connective tissue

So the bridge I see is this:

- classical statistics asks how to make principled decisions from uncertain data
- modern reward-based post-training asks how to shape model behavior from imperfect feedback

In both cases, the hard part is not just optimization. The hard part is that the thing you optimize is usually only an approximation to what you actually want.
