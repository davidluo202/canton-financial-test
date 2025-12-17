#!/usr/bin/env python3
"""
测试备用市场数据源方案
使用Manus内置的Yahoo Finance Data API作为备用数据源
"""

import sys
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient
import json
from datetime import datetime

def test_yahoo_finance_data_api():
    """
    测试使用Manus内置的Yahoo Finance Data API获取市场数据
    这个API不同于我们当前使用的Yahoo Finance API，可以作为备用数据源
    """
    client = ApiClient()
    
    # 测试获取股票数据
    symbols = [
        '^DJI',      # 道琼斯
        '^IXIC',     # 纳斯达克
        '^GSPC',     # 标普500
        '^HSI',      # 恒生指数
        '000001.SS', # 上证指数
    ]
    
    results = []
    
    print("测试使用Yahoo Finance Data API获取市场数据...")
    print("=" * 60)
    
    for symbol in symbols:
        try:
            print(f"\n获取 {symbol} 数据...")
            
            # 使用get_stock_chart API获取实时数据
            response = client.call_api('YahooFinance/get_stock_chart', query={
                'symbol': symbol,
                'region': 'US',
                'interval': '1d',
                'range': '1d',  # 只获取最新一天的数据
            })
            
            if response and 'chart' in response and 'result' in response['chart']:
                result = response['chart']['result'][0]
                meta = result['meta']
                
                # 提取关键数据
                data = {
                    'symbol': symbol,
                    'price': meta.get('regularMarketPrice', 0),
                    'previousClose': meta.get('previousClose', 0),
                    'change': 0,
                    'changePercent': 0,
                    'currency': meta.get('currency', 'USD'),
                }
                
                # 计算涨跌
                if data['previousClose'] > 0:
                    data['change'] = data['price'] - data['previousClose']
                    data['changePercent'] = (data['change'] / data['previousClose']) * 100
                
                results.append(data)
                
                print(f"  ✓ 成功: {symbol}")
                print(f"    价格: {data['price']}")
                print(f"    涨跌: {data['change']:.2f} ({data['changePercent']:.2f}%)")
            else:
                print(f"  ✗ 失败: {symbol} - 无数据")
                
        except Exception as e:
            print(f"  ✗ 错误: {symbol} - {str(e)}")
    
    print("\n" + "=" * 60)
    print(f"成功获取 {len(results)}/{len(symbols)} 个市场数据")
    
    # 保存结果到文件
    output_file = '/home/ubuntu/canton-financial-test/backup-data-source-test-results.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'source': 'Yahoo Finance Data API (Manus Built-in)',
            'success_count': len(results),
            'total_count': len(symbols),
            'data': results
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n结果已保存到: {output_file}")
    
    return results

if __name__ == "__main__":
    test_yahoo_finance_data_api()
