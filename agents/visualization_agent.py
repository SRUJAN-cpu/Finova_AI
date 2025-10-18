# visualization_agent.py
from strands import Agent, tool
from strands.models import BedrockModel
from pydantic import BaseModel, Field
from typing import Dict
import matplotlib.pyplot as plt

# Structured output model
class ChartOutput(BaseModel):
    chart_title: str = Field(description="Title of the generated chart")
    chart_path: str = Field(description="Path or filename of the saved chart image")

# System prompt for visualization agent
VISUALIZATION_PROMPT = """
You are a Visualization AI assistant. Your role is to create charts and dashboards to represent structured data clearly. 
You help MSPs and IT teams by converting financial, client, or operational data into visual insights.

When generating visualizations:
1. Use pie charts for categorical breakdowns (expenses, clients, resources)
2. Use line charts for trends over time
3. Save charts as images and return the path
4. Provide descriptive titles and labels
"""

# Bedrock model configuration
bedrock_model = BedrockModel(
    model_id="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    region_name="us-west-2",
    temperature=0.0
)

@tool
def create_chart(data_dict: Dict[str, float], chart_title: str = "Chart") -> ChartOutput:
    """Create a pie chart from the given data dictionary."""
    if not data_dict:
        return ChartOutput(chart_title=chart_title, chart_path="No data provided")
    
    labels = list(data_dict.keys())
    values = list(data_dict.values())
    colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", "#FF9FF3"]

    plt.figure(figsize=(8, 6))
    plt.pie(
        values,
        labels=labels,
        autopct="%1.1f%%",
        colors=colors[: len(values)],
        startangle=90,
    )
    plt.title(chart_title, fontsize=14, fontweight="bold")
    plt.axis("equal")
    file_name = f"{chart_title.replace(' ', '_')}.png"
    plt.savefig(file_name)
    plt.close()

    return ChartOutput(chart_title=chart_title, chart_path=file_name)

# Create visualization agent
visualization_agent = Agent(
    model=bedrock_model,
    system_prompt=VISUALIZATION_PROMPT,
    tools=[create_chart],
    callback_handler=None
)

if __name__ == "__main__":
    sample_data = {"Needs": 3000, "Wants": 1800, "Savings": 1200}
    chart = create_chart(sample_data, "Monthly Budget Breakdown")
    print(chart)
