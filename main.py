from strands import Agent, tool
from strands.models import BedrockModel
from strands.agent.conversation_manager import SummarizingConversationManager

# Import all agents
from agents.budget_agent import budget_agent, FinancialReport
from agents.financial_analysis_agent import financial_analysis_agent, InvestmentRecommendation
from agents.client_performance_agent import client_performance_agent, ClientPerformanceReport
# from agents.forecasting_agent import forecasting_agent, ForecastReport
from agents.visualization_agent import visualization_agent
from agents.sales_marketing_recommender_agent import sales_marketing_recommender_agent, SalesRecommendationReport

# Orchestrator system prompt
ORCHESTRATOR_PROMPT = """You are a comprehensive MSP financial and growth advisor orchestrator.
Your specialized agents are:
1. **budget_agent** - handles budgeting, spending analysis, savings goals
2. **financial_analysis_agent** - handles investments, portfolio performance
3. **client_performance_agent** - tracks client profitability and engagement
4. **forecasting_agent** - predicts revenue, expenses, and resource requirements
5. **visualization_agent** - creates charts, dashboards, and visual insights
6. **sales_marketing_recommender_agent** - provides upsell, cross-sell, and campaign recommendations

Guidelines:
- Determine which agent(s) to use per user query
- Call relevant agent(s) with focused queries
- Synthesize outputs into coherent structured reports
- Maintain a professional and helpful tone
- Include actionable next steps wherever possible"""

# Conversation manager
conversation_manager = SummarizingConversationManager(
    summary_ratio=0.3,
    preserve_recent_messages=5
)

# Bedrock model for orchestrator
bedrock_model = BedrockModel(
    model_id="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    region_name="us-west-2",
    temperature=0.0,
)

# Wrap agents as tools
@tool
def budget_agent_tool(query: str) -> FinancialReport:
    return budget_agent.structured_output(FinancialReport, prompt=query)

@tool
def financial_analysis_agent_tool(query: str) -> InvestmentRecommendation:
    return financial_analysis_agent.structured_output(InvestmentRecommendation, prompt=query)

@tool
def client_performance_agent_tool(query: str) -> ClientPerformanceReport:
    return client_performance_agent.structured_output(ClientPerformanceReport, prompt=query)

# @tool
# def forecasting_agent_tool(query: str) -> ForecastReport:
#     return forecasting_agent.structured_output(ForecastReport, prompt=query)

@tool
def visualization_agent_tool(data_dict: dict, chart_title: str) -> str:
    return visualization_agent(data_dict, chart_title)

@tool
def sales_marketing_recommender_agent_tool(query: str) -> SalesRecommendationReport:
    return sales_marketing_recommender_agent(query)

# Create orchestrator agent
orchestrator_agent = Agent(
    model=bedrock_model,
    system_prompt=ORCHESTRATOR_PROMPT,
    tools=[
        budget_agent_tool,
        financial_analysis_agent_tool,
        client_performance_agent_tool,
        visualization_agent_tool,
        sales_marketing_recommender_agent_tool
    ],
    conversation_manager=conversation_manager
        # forecasting_agent_tool,
)

if __name__ == "__main__":
    # Example query combining budgeting + investment + marketing
    response = orchestrator_agent(
        "I earn $6000/month and want to save $500 for investments. "
        "Help me create a budget, suggest investments, and recommend marketing actions for my MSP clients."
    )
    print(response)
