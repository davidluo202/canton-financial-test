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
                ? "誠港金融股份有限公司為香港證監會認可的持牌法團（中央編號：BSU667），提供證券並受其監管"
                : "Canton Mutual Financial Limited provides services and is regulated as a licensed corporation recognized by the Securities and Futures Commission of Hong Kong (Central No.: BSU667)"}
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
                {language === "zh" ? "免責聲明" : "Disclaimer"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">Made with Manus</p>
          </div>
        </div>
      </footer>

      {/* Disclaimer Dialog */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {language === "zh" ? "免責聲明" : "Disclaimer"}
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            {language === "zh" ? (
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>免責聲明：</strong>誠港金融股份有限公司（下稱「本公司」）為香港證券及期貨事務監察委員會（SFC）認可的持牌法團（牌照編號：BSU667），獲發第1類（證券交易）、第4類（就證券提供意見）及第9類（資產管理）牌照。
                </p>
                <p>
                  本網站所載資料僅供一般參考用途，並不構成，也不應被視為任何形式的投資建議、要約、招攬、推薦或保證。投資涉及風險，過往業績並不代表未來表現。投資者在作出任何投資決定前，應根據個人情況尋求獨立的專業意見。
                </p>
                <p>
                  本公司已盡力確保本網站資料的準確及完整，但對其內容的準確性、可靠性、時效性或完整性不作任何明示或暗示的保證。對於因使用或倚賴本網站內容而引致的任何損失或損害，本公司概不承擔任何責任。
                </p>
                <p>
                  本網站可能包含由第三方提供的鏈接或資料，本公司對該等外部內容的準確性或可靠性不承擔責任。
                </p>
                <p>
                  訪問本網站及使用本網站內容，即表示您同意本免責聲明的所有條款。
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>Disclaimer</strong>
                </p>
                <p>
                  Canton Mutual Financial Limited ("the Company") is a corporation licensed by the Securities and Futures Commission (SFC) of Hong Kong (Central No.: BSU667), holding Type 1 (Dealing in Securities), Type 4 (Advising on Securities), and Type 9 (Asset Management) licenses.
                </p>
                <p>
                  The information contained in this website is for general informational purposes only and does not constitute, nor should it be regarded as, any form of investment advice, offer, solicitation, recommendation, or guarantee. Investment involves risks, and past performance is not indicative of future results. Investors should seek independent professional advice before making any investment decisions.
                </p>
                <p>
                  While the Company has made every effort to ensure the accuracy and completeness of the information contained herein, it makes no express or implied warranty regarding the accuracy, reliability, timeliness, or completeness of the information. The Company accepts no liability for any loss or damage arising from the use of or reliance upon the contents of this website.
                </p>
                <p>
                  This website may contain links or materials provided by third parties. The Company does not accept any responsibility for the accuracy or reliability of such external content.
                </p>
                <p>
                  By accessing this website and using its contents, you acknowledge and agree to all the terms set out in this Disclaimer.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
