"use client";

import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Suspense } from "react";

const DashboardLayout = () => {
  const location = useLocation();
  const noPaddingRoutes = [
    "/whatsapp/livechat",
    "/whatsapp/utility/createbot",
    "/",
    "/workflow/createworkflow",
    "/survey/create",
    "/whatsapp/managewaba",
    "/utility/managewebassistAi",
    "/utility/webassistaibot",
    "/whatsapp/utility/QRcode",
    "/instagram/createInstagramBot",
  ];
  const greenBgRoutes = [
    "/whatsapp/pushcampaign",
    "/managewhatsapptemplate",
    "/whatsapp/report",
    "/createwhatsapptemplate",
    "/whatsapp/livechat",
    "/whatsapp/utility/manageagent",
    "/whatsapp/utility/managebot",
    "/whatsapp/utility/botreport",
    "/whatsapp/utility/managetags",
    "/whatsapp/managewaba",
    "/whatsapp/utility/autoresponse",
    "/whatsapp/utility/QRcode",
    "/whatsapp/ChatAnalysis",
    "/whatsapp/ChatHistory",
  ];
  const redBgRoutes = [
    "/rcs/pushcampaign",
    "/rcs/report",
    "/rcs/managetemplate",
    "/rcs/createtemplate",
    "/rcs/suggestionreport",
  ];
  const cyanBgRoutes = [
    "/sendsms",
    "/sms/report",
    "/smsreport",
    "/smsdlttemplate",
  ];
  const instagramRoutes = [
    "/instagram/createInstagramBot",
    "/instagram/manageinstabot",
    "/instagram/manageinstatemplate",
    "/instagram/createinstagramtemplate",
    "/instagram/manageinstagram",
    "/instagram/managepost",
  ];

  const hasgreenBg = greenBgRoutes.includes(location.pathname);
  const hasredBg = redBgRoutes.includes(location.pathname);
  const hascyanBg = cyanBgRoutes.includes(location.pathname);
  const hasInstagramBg = instagramRoutes.includes(location.pathname);
  const hasPadding = !noPaddingRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-full w-full bg-background">
      <main
        className={`flex-1 w-full  ${
          hasPadding
            ? "px-2 sm:px-4 !max-w-full md:px-8 py-2 sm:py-4"
            : "p-0 m-0 max-w-none"
        } overflow-auto ${
          hasgreenBg
            ? "bg-gradient-to-r from-[#f3fff8] via-[#ecf5ef] to-[#dff0e5]"
            : hasredBg
            ? "bg-gradient-to-r from-[#f9efff] via-[#f7efff] to-[#f7f0ff]"
            : hascyanBg
            ? "bg-gradient-to-r from-[#f1feff] via-[#effeff] to-[#ecfcfd]"
            : hasInstagramBg
            ? "bg-gradient-to-r from-[#fbf4fd] via-[#fef1ff] to-[#fdf1fc]"
            : "bg-[linear-gradient(to_right,#CFDEF3,#E0EAFC)]"
        }`}
      >
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
};

export default DashboardLayout;