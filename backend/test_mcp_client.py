import asyncio
from fastmcp import Client
from mcp_server import mcp


async def test():
    async with Client(mcp) as client:
        tools = await client.list_tools()

        print("\nAvailable MCP tools:")
        for tool in tools:
            print(f"- {tool.name}")

        print("\nCalling search_knowledge_base...\n")

        result = await client.call_tool(
            "search_knowledge_base",
            {
                "query": "What is this document about?"
            }
        )

        print("MCP Response:")
        print(result)


if __name__ == "__main__":
    asyncio.run(test())