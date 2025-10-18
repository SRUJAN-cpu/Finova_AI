from strands import Agent, tool
from strands.models import BedrockModel
from pydantic import BaseModel, Field
from typing import List, Dict

# ==========================
# Structured output models
# ==========================
class InvestmentRecommendation(BaseModel):
    asset_name: str = Field(description="Name of the investment asset (stock, bond, ETF, etc.)")
    asset_type: str = Field(description="Type of asset, e.g., Stock, Bond, ETF, Mutual Fund")
    allocation_percentage: float = Field(description="Recommended allocation as percentage of portfolio")
    expected_return: float = Field(description="Expected annual return in percentage")
    risk_score: int = Field(ge=1, le=10, description="Risk score from 1 (low) to 10 (high)")

class PortfolioReport(BaseModel):
    portfolio_value: float = Field(description="Total value of the user's investment portfolio")
    recommendations: List[InvestmentRecommendation] = Field(description="List of investment recommendations")
    overall_risk_score: int = Field(ge=1, le=10, description="Overall portfolio risk score")
    summary: str = Field(description="Summary of portfolio analysis and suggestions")

# ==========================
# System prompt
# ==========================
FINANCIAL_ANALYSIS_PROMPT = """
You are a professional financial analyst. Your task is to provide investment advice and portfolio recommendations.
You do NOT provide personal banking advice. Always provide structured output in PortfolioReport format.

When analyzing investments:
1. Provide a diversified allocation based on user's income, goals, and risk tolerance.
2. Include risk scoring (1-10) for each asset and overall portfolio.
3. Provide expected annual returns and asset type.
4. Summarize actionable recommendations for portfolio improvement.
5. Include a final summary paragraph explaining reasoning behind the recommendations.
"""

# ==========================
# Bedrock model
# ==========================
bedrock_model = BedrockModel(
    model_id="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    region_name="us-west-2",
    temperature=0.0,  # deterministic outputs for financial analysis
)

# ==========================
# Tools / helper functions
# ==========================
@tool
def analyze_portfolio(current_portfolio: Dict[str, float], monthly_investment: float, risk_tolerance: str="medium") -> PortfolioReport:
    """
    Analyze existing portfolio and suggest improvements.
    current_portfolio: dictionary of assets with current allocation amounts
    monthly_investment: amount to invest monthly
    risk_tolerance: low, medium, high
    """
    # For demo purposes, we simulate structured response (AI will replace logic in real case)
    sample_recommendations = [
        InvestmentRecommendation(
            asset_name="S&P 500 ETF",
            asset_type="ETF",
            allocation_percentage=50.0,
            expected_return=8.0,
            risk_score=5
        ),
        InvestmentRecommendation(
            asset_name="Bond Fund",
            asset_type="Bond",
            allocation_percentage=30.0,
            expected_return=4.0,
            risk_score=2
        ),
        InvestmentRecommendation(
            asset_name="Tech Stocks",
            asset_type="Stock",
            allocation_percentage=20.0,
            expected_return=12.0,
            risk_score=8
        )
    ]
    total_portfolio_value = sum(current_portfolio.values()) + monthly_investment
    return PortfolioReport(
        portfolio_value=total_portfolio_value,
        recommendations=sample_recommendations,
        overall_risk_score=5,
        summary=f"Based on your current portfolio and risk tolerance ({risk_tolerance}), "
                f"we recommend diversifying across ETFs, Bonds, and selected Stocks to balance risk and returns."
    )

# ==========================
# Financial Analysis Agent
# ==========================
financial_analysis_agent = Agent(
    model=bedrock_model,
    system_prompt=FINANCIAL_ANALYSIS_PROMPT,
    tools=[analyze_portfolio],
    callback_handler=None,
)

# ==========================
# Testing
# ==========================
if __name__ == "__main__":
    demo_portfolio = {"Cash": 2000, "S&P 500 ETF": 5000, "Bonds": 2000}
    report = analyze_portfolio(demo_portfolio, monthly_investment=500, risk_tolerance="medium")

    print(f"\nPortfolio Value: ${report.portfolio_value:,.0f}")
    print(f"Overall Risk Score: {report.overall_risk_score}/10")
    print("\nRecommendations:")
    for rec in report.recommendations:
        print(f"• {rec.asset_name} ({rec.asset_type}) - {rec.allocation_percentage}% allocation, "
              f"Expected Return: {rec.expected_return}%, Risk Score: {rec.risk_score}")
    print(f"\nSummary:\n{report.summary}")
