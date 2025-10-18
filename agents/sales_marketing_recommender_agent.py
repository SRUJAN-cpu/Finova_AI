from strands import Agent, tool
from strands.models import BedrockModel
from pydantic import BaseModel, Field
from typing import List

# Structured output model
class SalesRecommendationReport(BaseModel):
    recommendations: List[str] = Field(description="List of actionable sales/marketing recommendations")
    priority_actions: List[str] = Field(description="High-priority actions for MSP growth")

# System prompt for this agent
SALES_MARKETING_PROMPT = """You are an AI agent helping MSPs optimize sales and marketing.
Provide actionable recommendations, upsell/cross-sell strategies, and campaign suggestions.
Always prioritize actions that drive growth and revenue.
Use structured output when requested to provide comprehensive reports."""

# Bedrock model configuration
bedrock_model = BedrockModel(
    model_id="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    region_name="us-west-2",
    temperature=0.0,
)

@tool
def sales_marketing_recommender_agent(query: str) -> SalesRecommendationReport:
    """Generate structured sales/marketing recommendations."""
    # In real use-case, this will call bedrock_model to generate recommendations
    # For now, we give a static structured example
    return SalesRecommendationReport(
        recommendations=[
            "Upsell premium support packages to top 3 clients",
            "Launch email marketing campaign targeting inactive clients",
            "Implement referral program for existing clients"
        ],
        priority_actions=[
            "Upsell top clients",
            "Email campaign",
            "Referral program setup"
        ]
    )
