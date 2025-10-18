# from strands import Agent, tool
# from strands.models import BedrockModel
# from pydantic import BaseModel, Field
# from typing import List, Dict
# import pandas as pd
# from statsmodels.tsa.holtwinters import ExponentialSmoothing
# import matplotlib.pyplot as plt


# # Structured output for forecasting
# class ForecastEntry(BaseModel):
#     month: str = Field(description="Month of the forecast")
#     predicted_revenue: float = Field(description="Predicted revenue for the month")
#     predicted_expenses: float = Field(description="Predicted expenses for the month")


# class ForecastReport(BaseModel):
#     forecast_entries: List[ForecastEntry] = Field(description="Monthly forecast entries")
#     summary: str = Field(description="Summary of forecasted financial trends")


# FORECAST_SYSTEM_PROMPT = """You are an expert financial forecasting assistant.
# You analyze historical revenue and expense data to predict future trends.
# When generating forecasts:
# 1. Provide month-wise revenue and expense predictions
# 2. Summarize key trends and patterns in a short, actionable summary
# 3. Provide structured output for integration into dashboards or other agents
# 4. Visualize trends using charts if requested
# Always use structured output when generating forecasts."""


# # Configure Bedrock model
# bedrock_model = BedrockModel(
#     model_id="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
#     region_name="us-west-2",
#     temperature=0.0,
# )


# @tool
# def generate_forecast(data: Dict[str, List[float]]) -> ForecastReport:
#     """
#     data = {
#         "months": ["Jan", "Feb", "Mar"],
#         "revenue": [5000, 5200, 5400],
#         "expenses": [3000, 3100, 3200]
#     }
#     """
#     months = data.get("months", [])
#     revenue = data.get("revenue", [])
#     expenses = data.get("expenses", [])

#     if not months or not revenue or not expenses:
#         return ForecastReport(forecast_entries=[], summary="No data provided")

#     # Convert to pandas series
#     rev_series = pd.Series(revenue, index=pd.period_range(start=1, periods=len(revenue), freq="M"))
#     exp_series = pd.Series(expenses, index=pd.period_range(start=1, periods=len(expenses), freq="M"))

#     # Forecast next 3 months
#     rev_model = ExponentialSmoothing(rev_series, trend="add", seasonal=None)
#     exp_model = ExponentialSmoothing(exp_series, trend="add", seasonal=None)
#     rev_fit = rev_model.fit()
#     exp_fit = exp_model.fit()
#     rev_forecast = rev_fit.forecast(3)
#     exp_forecast = exp_fit.forecast(3)

#     forecast_entries = []
#     for i in range(3):
#         forecast_entries.append(
#             ForecastEntry(
#                 month=f"Month {len(months) + i + 1}",
#                 predicted_revenue=round(rev_forecast[i], 2),
#                 predicted_expenses=round(exp_forecast[i], 2),
#             )
#         )

#     # Optional chart
#     plt.figure(figsize=(8, 5))
#     plt.plot(months + [f"Month {len(months) + i + 1}" for i in range(3)],
#              revenue + list(rev_forecast),
#              marker='o', label='Revenue')
#     plt.plot(months + [f"Month {len(months) + i + 1}" for i in range(3)],
#              expenses + list(exp_forecast),
#              marker='o', label='Expenses')
#     plt.title("Revenue & Expense Forecast")
#     plt.xlabel("Month")
#     plt.ylabel("Amount ($)")
#     plt.legend()
#     plt.tight_layout()
#     plt.show()

#     summary = "Revenue is predicted to grow steadily over the next 3 months, while expenses increase slightly. Consider optimizing costs to improve profitability."

#     return ForecastReport(forecast_entries=forecast_entries, summary=summary)


# # Create forecasting agent
# forecasting_agent = Agent(
#     model=bedrock_model,
#     system_prompt=FORECAST_SYSTEM_PROMPT,
#     tools=[generate_forecast],
# )
