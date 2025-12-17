#!/usr/bin/env python3
"""
测试Yahoo Finance API获取市场数据
测试获取股票指数、外汇和贵金属数据
"""

import sys
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient
import json

def test_market_data():
    client = ApiClient()
    
    # 测试股票指数
    indices = {
        '^DJI': '道琼斯指数 (Dow Jones)',
        '^IXIC': '纳斯达克综合指数 (NASDAQ)',
        '^GSPC': '标普500指数 (S&P 500)',
        '000001.SS': '上证综合指数 (Shanghai Composite)',
        '^HSI': '恒生指数 (Hang Seng Index)'
    }
    
    # 测试外汇
    forex = {
        'CNY=X': '美元/人民币 (USD/CNY)',
        'EURUSD=X': '欧元/美元 (EUR/USD)',
        'JPY=X': '美元/日元 (USD/JPY)',
        'GBPUSD=X': '英镑/美元 (GBP/USD)'
    }
    
    # 测试贵金属
    commodities = {
        'GC=F': '黄金期货 (Gold Futures)',
        'SI=F': '白银期货 (Silver Futures)'
    }
    
    all_symbols = {**indices, **forex, **commodities}
    
    results = {}
    
    print("开始测试市场数据API...")
    print("=" * 80)
    
    for symbol, name in all_symbols.items():
        try:
            print(f"\n测试 {name} ({symbol})...")
            
            response = client.call_api('YahooFinance/get_stock_chart', query={
                'symbol': symbol,
                'region': 'US',
                'interval': '1d',
                'range': '1d',
                'includeAdjustedClose': False
            })
            
            if response and 'chart' in response and 'result' in response['chart']:
                result = response['chart']['result'][0]
                meta = result['meta']
                
                # 获取当前价格
                current_price = meta.get('regularMarketPrice', 0)
                previous_close = meta.get('previousClose', 0)
                
                # 计算涨跌
                change = current_price - previous_close if previous_close else 0
                change_percent = (change / previous_close * 100) if previous_close else 0
                
                results[symbol] = {
                    'name': name,
                    'symbol': symbol,
                    'price': current_price,
                    'change': change,
                    'changePercent': change_percent,
                    'currency': meta.get('currency', 'USD')
                }
                
                print(f"  ✓ 成功")
                print(f"    当前价格: {current_price} {meta.get('currency', 'USD')}")
                print(f"    涨跌额: {change:+.2f}")
                print(f"    涨跌幅: {change_percent:+.2f}%")
            else:
                print(f"  ✗ 无数据")
                results[symbol] = None
                
        except Exception as e:
            print(f"  ✗ 错误: {str(e)}")
            results[symbol] = None
    
    print("\n" + "=" * 80)
    print("\n测试结果汇总:")
    print(f"成功: {sum(1 for v in results.values() if v is not None)}/{len(all_symbols)}")
    
    # 保存结果到JSON文件
    with open('/home/ubuntu/canton-financial-test/market-data-test-results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print("\n结果已保存到: market-data-test-results.json")
    
    return results

if __name__ == "__main__":
    test_market_data()
