from rllogger import RLLogger
from model import plot_metrics

logger = RLLogger.load("log.pkl")
plot_metrics(logger)