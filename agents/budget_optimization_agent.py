from strands import Agent, tool
from strands.models import BedrockModel
from pydantic import BaseModel, Field
from typing import List, Dict

# ==========================
# Structured output models
# ==========================
class CostItem(BaseModel):
    category: str = Field(description="Category of IT spend or software")
    current_cost: float = Field(description="Current spend in USD")
    recommended_cost: float = Field(description="Optimized/recommended spend in USD")
    savings_opportunity: float = Field(description="Potential savings in USD")

class BudgetOptimizationReport(BaseModel):
    total_spend: float = Field(description="Total current IT spend")
    optimized_spend: float = Field(description="Total optimized IT spend")
    savings: float = Field(description="Total potential savings")
    recommendations: List[CostItem] = Field(description="Detailed cost-saving recommendations per category")
    summary: str = Field(description="Summary of optimization insights and action items")

# ==========================
# System prompt
# ==========================
BUDGET_OPTIMIZATION_PROMPT = """
You are an IT budget optimization expert for MSPs and IT teams. Your goal is to analyze software, licenses, and departmental spend to find inefficiencies and recommend cost savings.

When analyzing budgets:
1. Identify underutilized software or licenses.
2. Detect anomalies or overspending in categories.
3. Suggest actionable cost reduction steps.
4. Provide structured output in BudgetOptimizationReport format.
5. Maintain a professional, concise, and analytical tone.
"""

# ==========================
# Bedrock model
# ==========================
bedrock_model = BedrockModel(
    model_id="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    region_name="us-west-2",
    temperature=0.0,  # deterministic output
)

# ==========================
# Tools / helper functions
# ==========================
@tool
def optimize_it_budget(spend_data: List[Dict]) -> BudgetOptimizationReport:
    """
    Analyze IT spend and generate optimization recommendations.
    spend_data: List of dicts with keys: category, current_cost, utilization_percentage
    """
    recommendations = []
    total_spend = 0
    optimized_spend = 0

    for item in spend_data:
        total_spend += item["current_cost"]
        # Example logic: reduce cost proportional to underutilization
        recommended_cost = item["current_cost"] * (item.get("utilization_percentage", 100) / 100)
        savings_opportunity = item["current_cost"] - recommended_cost
        optimized_spend += recommended_cost

        recommendations.append(
            CostItem(
                category=item["category"],
                current_cost=item["current_cost"],
                recommended_cost=round(recommended_cost, 2),
                savings_opportunity=round(savings_opportunity, 2),
            )
        )

    summary = (
        f"Total IT spend: ${total_spend:,.2f}. "
        f"Optimized spend: ${optimized_spend:,.2f}. "
        f"Potential savings: ${total_spend - optimized_spend:,.2f}. "
        f"Focus on reducing spend on underutilized software and renegotiating licenses."
    )

    return BudgetOptimizationReport(
        total_spend=round(total_spend, 2),
        optimized_spend=round(optimized_spend, 2),
        savings=round(total_spend - optimized_spend, 2),
        recommendations=recommendations,
        summary=summary,
    )

# ==========================
# Budget Optimization Agent
# ==========================
budget_optimization_agent = Agent(
    model=bedrock_model,
    system_prompt=BUDGET_OPTIMIZATION_PROMPT,
    tools=[optimize_it_budget],
    callback_handler=None,
)

# ==========================
# Testing
# ==========================
if __name__ == "__main__":
    sample_spend_data = [
        {"category": "MS Office Licenses", "current_cost": 5000, "utilization_percentage": 80},
        {"category": "Cloud Storage", "current_cost": 2000, "utilization_percentage": 50},
        {"category": "Project Management Tools", "current_cost": 1500, "utilization_percentage": 30},
    ]

    report = optimize_it_budget(sample_spend_data)
    print(f"Total Spend: ${report.total_spend}")
    print(f"Optimized Spend: ${report.optimized_spend}")
    print(f"Potential Savings: ${report.savings}")
    print("\nRecommendations:")
    for rec in report.recommendations:
        print(f"• {rec.category}: Current ${rec.current_cost}, Recommended ${rec.recommended_cost}, Savings ${rec.savings_opportunity}")
    print(f"\nSummary:\n{report.summary}")
