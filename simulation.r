# Simulation in R

# Set seed for reproducibility
set.seed(123)

# Number of simulations
n_sim <- 10000

# Simulate X and Y from binomial distributions
X <- rbinom(n_sim, size = 50, prob = 0.10)
Y <- rbinom(n_sim, size = 20, prob = 0.25)

# Compute Z = 3X + 2Y
Z <- 3 * X + 2 * Y

# Calculate empirical mean and variance
empirical_mean <- mean(Z)
empirical_var <- var(Z)

# Plot histogram with normal curve overlay
hist(Z, breaks = 30, probability = TRUE,
     main = "Distribution of Z = 3X + 2Y",
     xlab = "Z values", col = "lightblue")

curve(dnorm(x, mean = 25, sd = sqrt(55.5)),
      add = TRUE, col = "red", lwd = 2)

legend("topright",
       legend = c("Empirical", "Theoretical N(25,55.5)"),
       col = c("lightblue", "red"),
       lwd = c(10, 2),
       bty = "n")