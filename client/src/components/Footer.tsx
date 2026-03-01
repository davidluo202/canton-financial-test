"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Footer() {
  const { language } = useLanguage();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <>
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-300">
              {language === "zh"
                ? "誠港金融股份有限公司為香港證監會認可的持牌法團（中央編號：BSU667），受其監管并为客户提供證券交易和服务"
                : "Canton Mutual Financial Limited is a licensed corporation recognized by the Hong Kong Securities and Futures Commission (Central Number: BSU667), regulated by it and provides securities trading and services to clients"}
            </p>
            <p className="text-sm text-gray-400">
              {language === "zh"
                ? "© 2025 誠港金融股份有限公司版權所有"
                : "© 2025 Canton Mutual Financial Limited All Rights Reserved"}
            </p>
            <div className="mt-4">
              <button
                onClick={() => setShowDisclaimer(true)}
                className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm underline transition-colors"
              >
                {language === "zh" ? "免責聲明和使用條款" : "Disclaimer & Terms of Use"}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Disclaimer Dialog */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-slate-900 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {language === "zh" ? "免責聲明和使用條款" : "Disclaimer & Terms of Use"}
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none prose-invert">
            {language === "zh" ? (
              <div className="space-y-4 text-gray-100 leading-relaxed text-sm">
                <h3 className="text-lg font-semibold text-white">免責聲明和使用條款</h3>
                
                <p>
                  本網站及其所載之所有資料、內容及意見，僅供一般資訊用途，並不構成對任何人士提供投資建議、邀約或要約。投資涉及風險，證券、期貨、資產價格可升亦可跌，投資人可能蒙受全部損失。
                </p>

                <p>
                  誠港金融股份有限公司（Canton Mutual Financial Limited）為香港持牌法團（中央編號：BSU667），持有第 1 號（證券交易）、第 4 號（就證券提供意見）及第 9 號（資產管理）受規管活動牌照，受香港證券及期貨事務監察委員會（SFC）規管。本网站之使用条件及所载资料，仅适用于居住或营业地设于香港特别行政区的个人或公司。若你身处香港以外司法管辖区，或从事香港以外地区之投资／交易活动，须确保符合当地法律及监管规定。
                </p>

                <p>
                  本公司雖然力求所提供資料準確可靠，但不保證其正確性、完整性、適合性或無瑕疵，包括不保證資料不會含有電腦病毒或被駭客攻擊。凡依賴本網站資料而作出之決定，風險由使用者自行承擔。
                </p>

                <p>
                  本公司對你使用本網站，或因使用本網站而產生之任何直接、間接、附帶、特別或相應損失，包括但不限於利潤損失或儲蓄損失，均不負任何責任，除非適用條款及細則另有明確規定。本网站可能包含指向第三方网站或资源之链接。该等链接仅为方便而设，本公司不调查、核实该等资源内容、准确性、意见或所提供服务，因此对其承担任何责任风险由用户自行承担。
                </p>

                <p>
                  本網站及其內容之所有智慧財產權（包括但不限於版權、商標、專利或商業機密）均歸本公司或其內容提供者所有。未經本公司事先書面同意，不得轉載、傳送、修改、重新發布、倒序設計、解編或以任何方式利用。
                </p>

                <p>
                  使用者應就使用本網站所提交或提供給本公司之資料或資料，授予本公司全球性、免許可使用費、永久、可分許可、可再授權之權利，用於本公司認為適當之用途（包括複製、傳送、分發及出版）– 除非適用法律另有規定。
                </p>

                <p>
                  若因你違反本網站使用條款或相關法規，而令本公司遭受任何法律行動、索償、責任、損失或費用（包括律師費），你將應要求向本公司作出賠償，使本公司免受損害並承擔其抗辯義務。
                </p>

                <p>
                  本網站所載資料並非在任何司法管轄區構成出售、認購或交易任何股票、證券、基金、單位信託、債務、貸款、存款或其他投資工具之邀約、要約或意見。若你繼續使用本網站，即表示你確認並非居住於香港以外司法管轄區，亦不打算由香港以外之司法管轄區透過本公司購買或認購任何產品或使用任何服務。
                </p>

                <p>
                  某些產品或服務可能須收取費用、佣金或其他手續費，詳情請向本公司查詢。任何產品或服務可由本公司酌情提供，且可在無須另行通知下撤回或修訂。
                </p>

                <p>
                  本公司保留在無需預先警告或發出通知的情況下，酌情更改本網站所載任何資料或使用條款或細則之權利。
                </p>

                <p>
                  本免責聲明及使用條款受香港法律管轄，你同意香港法院對本免責聲明及使用條款具有非專屬司法管轄權。
                </p>

                <p className="font-semibold">
                  若你不同意本免責聲明或使用條款，請立即停止使用本網站。
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-gray-100 leading-relaxed text-sm">
                <h3 className="text-lg font-semibold text-white">Disclaimer & Terms of Use</h3>
                
                <p>
                  The information, content and opinions contained on this website are provided for general information only and do not constitute investment advice, solicitation or an offer. Investment involves risks; the value of securities, futures, or other assets may rise and fall, and investors may lose all their invested capital.
                </p>

                <p>
                  Canton Mutual Financial Limited is a licensed corporation in Hong Kong (CE No. BSU667), holding licences for Regulated Activities Type 1 (Dealing in Securities), Type 4 (Advising on Securities) and Type 9 (Asset Management), and is regulated by the Securities and Futures Commission (SFC). The terms of use for this website and the information therein are intended only for individuals or companies residing or carrying on business in the Hong Kong Special Administrative Region. If you are situated outside Hong Kong or engaging in transactions from jurisdictions outside Hong Kong, you must ensure compliance with the local laws and regulatory requirements.
                </p>

                <p>
                  While the Company endeavours to ensure accuracy and reliability of the information provided, it does not warrant that such information is correct, complete, fit for particular purpose or free from defects (including computer viruses or hacking). Users rely on the information at their own risk.
                </p>

                <p>
                  The Company shall not be liable for any direct, indirect, incidental, special or consequential losses or damages (including but not limited to loss of profits or savings) arising out of your access to or use of this website or any reliance on the information provided herein, unless otherwise specified in applicable terms and conditions.
                </p>

                <p>
                  The website may contain links to third-party websites or resources. These links are provided for convenience only. The Company does not review, verify, monitor, endorse or assume responsibility for the products, services or content of any such linked sites and you access them at your own risk.
                </p>

                <p>
                  All intellectual property rights in this website and its content (including but not limited to copyright, trademarks, patents or trade secrets) belong to the Company or the content provider. Unless with prior written consent of the Company, you shall not reproduce, transmit, modify, republish, reverse-engineer, decompile or otherwise use the website content for public, commercial or other purposes.
                </p>

                <p>
                  By submitting or providing any information or materials to the Company through your use of this website, you grant the Company a worldwide, royalty-free, perpetual, sublicensable and transferable license to use, reproduce, transmit, distribute and publish such information or materials for any purpose the Company deems appropriate – unless otherwise restricted by applicable law.
                </p>

                <p>
                  If you breach the terms of use of this website or any relevant laws or regulations and the Company incurs any legal action, claim, liability, loss or cost (including legal fees) as a result, you shall indemnify the Company on demand and hold the Company harmless.
                </p>

                <p>
                  Nothing on this website shall be construed as an invitation or offer to purchase, subscribe for or trade any stocks, securities, funds, unit trusts, debt obligations, loans, deposits or other investment instruments in any jurisdiction. By continuing to browse this website you confirm that you are not resident in any jurisdiction outside Hong Kong and have no intention to purchase or subscribe to any products or services via the Company from outside Hong Kong.
                </p>

                <p>
                  Some products or services may carry fees, commissions or other charges — please contact the Company for details. The Company provides any products or services at its discretion and may withdraw or amend them at any time without prior notice.
                </p>

                <p>
                  The Company reserves the absolute right at its sole discretion to amend any materials or the terms of use of this website without prior warning or notice.
                </p>

                <p>
                  These disclaimers and terms of use are governed by the laws of Hong Kong. You agree to the non-exclusive jurisdiction of the courts of Hong Kong over this disclaimer and the terms of use.
                </p>

                <p className="font-semibold">
                  If you disagree with this disclaimer or the terms of use, please cease use of this website immediately.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
