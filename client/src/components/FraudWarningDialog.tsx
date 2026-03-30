import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShieldAlert } from "lucide-react";

const SESSION_KEY = "cmf_fraud_warning_dismissed";

export default function FraudWarningDialog() {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Show once per session
    const dismissed = sessionStorage.getItem(SESSION_KEY);
    if (!dismissed) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-amber-500/40 text-white">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-amber-400">
            <ShieldAlert className="w-7 h-7" />
            <DialogTitle className="text-xl md:text-2xl font-bold text-amber-400">
              {language === "zh" ? "⚠️ 重要聲明" : "⚠️ Important Notice"}
            </DialogTitle>
            <ShieldAlert className="w-7 h-7" />
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2 text-sm md:text-base leading-relaxed">
          {/* Chinese Version */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-amber-300 border-b border-amber-500/30 pb-1">
              中文
            </h3>
            <p>
              近期，我司注意到有不法分子冒用<strong>誠港金融股份有限公司（Canton Mutual Financial Limited）</strong>的名義，通過偽造工牌、虛假應用程式（App）或其他方式進行欺詐活動。
            </p>
            <p>我司在此嚴正聲明如下：</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>
                誠港金融股份有限公司是一家在<strong>香港註冊成立</strong>並受<strong>香港證券及期貨事務監察委員會（SFC）</strong>監管的持牌機構，持有第1類（證券交易）、第4類（就證券提供意見）及第9類（提供資產管理）牌照。
              </li>
              <li>
                我司<strong>從未</strong>授權任何第三方以我司名義對外銷售任何金融產品或服務，亦<strong>從未</strong>發行或授權發行任何流動應用程式（App）供公眾下載。
              </li>
              <li>
                我司<strong>不設</strong>任何形式的對外銷售工牌。任何聲稱持有我司工牌進行銷售活動的行為均屬虛假及未經授權。
              </li>
              <li>
                我司所有官方資訊及服務<strong>僅</strong>通過本公司官方網站（<a href="https://www.cmfinancial.com" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">www.cmfinancial.com</a>）發佈。任何非經本網站發佈的系統、資訊或通訊均不代表我司立場。
              </li>
              <li>
                如閣下對任何以我司名義進行的通訊、邀約或活動有疑問，請通過我司官方網站上列明的聯繫方式以<strong>正式電子郵件</strong>向我司查詢核實。
              </li>
            </ol>
            <p className="text-amber-200 font-medium">
              我司懇請公眾提高警惕，謹防詐騙。如發現可疑活動，建議向香港警務處或證券及期貨事務監察委員會舉報。
            </p>
          </div>

          {/* Divider */}
          <hr className="border-slate-600" />

          {/* English Version */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-amber-300 border-b border-amber-500/30 pb-1">
              English
            </h3>
            <p>
              It has recently come to our attention that fraudulent individuals have been impersonating <strong>Canton Mutual Financial Limited</strong> by using forged identification badges, counterfeit mobile applications, or other deceptive means to conduct unauthorized activities.
            </p>
            <p>We hereby solemnly declare as follows:</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>
                Canton Mutual Financial Limited is a <strong>licensed corporation registered in Hong Kong</strong>, regulated by the <strong>Securities and Futures Commission (SFC)</strong>, holding Type 1 (Dealing in Securities), Type 4 (Advising on Securities) and Type 9 (Asset Management) licences.
              </li>
              <li>
                We have <strong>never</strong> authorized any third party to sell financial products or services on our behalf, nor have we <strong>ever</strong> developed, issued, or authorized any mobile application for public download.
              </li>
              <li>
                We do <strong>not</strong> issue any form of external sales identification badges. Any person claiming to hold such credentials from our company is acting fraudulently and without authorization.
              </li>
              <li>
                All official information and services of our company are published <strong>exclusively</strong> through our official website (<a href="https://www.cmfinancial.com" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">www.cmfinancial.com</a>). Any systems, information, or communications not published through this website do not represent our company.
              </li>
              <li>
                Should you have any doubts regarding any communication, solicitation, or activity purportedly conducted in our name, please verify directly with us via <strong>formal email</strong> using the contact details listed on our official website.
              </li>
            </ol>
            <p className="text-amber-200 font-medium">
              We urge the public to remain vigilant against fraud. If you encounter any suspicious activity, we recommend reporting it to the Hong Kong Police Force or the Securities and Futures Commission.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            onClick={handleClose}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3"
          >
            {language === "zh" ? "我已閱讀並了解" : "I Have Read and Understood"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
