"use client";

import { useState } from 'react';
import { Heart, X, Coffee, CreditCard, Copy, Check, QrCode, Github } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';

export function SponsorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const upiId = "priyanshprajapat@upi";
  const qrCodeUrl = "/upi-qr-code.png"; 
  
  const copyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUPI(true);
      setTimeout(() => setCopiedUPI(false), 2000);
    } catch (err) {
      console.error('Failed to copy UPI ID:', err);
    }
  };

  const openBuyMeACoffee = () => {
    window.open('https://buymeacoffee.com/priyazsh', '_blank');
  };

  const openPayPal = () => {
    window.open('https://paypal.me/oyepriyansh', '_blank');
  };

  const openGitHubSponsors = () => {
    window.open('https://github.com/sponsors/priyazsh', '_blank');
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="group bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14 sm:w-16 sm:h-16 p-0"
          aria-label="Sponsor us"
        >
          <Heart className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300 fill-current" />
        </Button>
      </div>

      {/* Sponsor Widget Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_50px_rgba(255,255,255,0.1)] max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-pink-500 fill-current" />
                  Support Our Work
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-full p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Help us keep is-a.software free and running! Your support means the world to us.
              </p>
            </CardHeader>
            
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">

              <div className="border border-[#333333] rounded-lg p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0C0C0C] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base">UPI Payment</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">For users in India</p>
                  </div>
                </div>
                <div className="bg-[#0C0C0C] p-3 rounded border border-[#333333] flex items-center justify-between">
                  <code className="text-green-400 text-xs sm:text-sm break-all">{upiId}</code>
                  <div className="flex gap-1">
                    <Button
                      onClick={copyUPI}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white hover:bg-[#1a1a1a] p-2"
                    >
                      {copiedUPI ? (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowQR(!showQR)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white hover:bg-[#1a1a1a] p-2"
                    >
                      <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                

                {showQR && (
                  <div className="mt-3 p-4 bg-[#0C0C0C] rounded-lg text-center border border-[#333333]">
                    <p className="text-gray-400 text-xs mb-2">Scan with any UPI app</p>
                    <Image 
                      src={qrCodeUrl} 
                      alt="UPI QR Code" 
                      width={160}
                      height={160}
                      className="mx-auto w-32 h-32 sm:w-40 sm:h-40 bg-white p-2 rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<p class="text-gray-400 text-sm">QR Code unavailable</p>';
                      }}
                    />
                    <p className="text-gray-500 text-xs mt-2">Pay to: {upiId}</p>
                  </div>
                )}
                
                {/* Mobile UPI Pay Button */}
                <div className="mt-3 sm:hidden">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 text-sm"
                  >
                    <a href={`upi://pay?pa=${upiId}&pn=Priyansh Prajapat&tn=sponsoring is-a.software&cu=INR`}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay via any UPI app
                    </a>
                  </Button>
                </div>
              </div>

              <div className="border border-[#333333] rounded-lg p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0C0C0C] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                    <Github className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base">GitHub Sponsors</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Recurring sponsorship</p>
                  </div>
                </div>
                <Button
                  onClick={openGitHubSponsors}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white border-0 text-sm sm:text-base"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Sponsor on GitHub
                </Button>
              </div>

              <div className="border border-[#333333] rounded-lg p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0C0C0C] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base">Buy Me a Coffee</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">One-time or monthly support</p>
                  </div>
                </div>
                <Button
                  onClick={openBuyMeACoffee}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 text-sm sm:text-base">
                  <Coffee className="w-4 h-4 mr-2" />
                  Support on Buy Me a Coffee
                </Button>
              </div>

              <div className="border border-[#333333] rounded-lg p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0C0C0C] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.408-.878C19.387 4.264 17.986 3.5 15.83 3.5h-7.46c-.524 0-.968.382-1.05.9L6.23 10.675h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.291-1.867-.002-3.137-1.012-4.287z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base">PayPal</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">International donations</p>
                  </div>
                </div>
                <Button
                  onClick={openPayPal}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.408-.878C19.387 4.264 17.986 3.5 15.83 3.5h-7.46c-.524 0-.968.382-1.05.9L6.23 10.675h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.291-1.867-.002-3.137-1.012-4.287z"/>
                  </svg>
                  Donate with PayPal
                </Button>
              </div>

              <div className="text-center pt-2">
                <p className="text-gray-400 text-xs sm:text-sm">
                  Thank you for supporting open source! 🙏
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}