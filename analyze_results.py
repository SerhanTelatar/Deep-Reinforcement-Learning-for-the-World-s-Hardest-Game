from rllogger import RLLogger
from model import plot_metrics

logger = RLLogger.load("log.pkl")  # Eğer logu dosyaya kaydediyorsan!
plot_metrics(logger)