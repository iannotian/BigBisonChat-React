import React, { useState } from "react";

import ConversationList from "../../src/components/conversations/Conversations"; // list of convos
import { MessageList } from "../../src/components/chat/MessageList"; // list of messages in a convo
import { MessageInput } from "../../src/components/chat/MessageInput"; // input bar for messages in chat window
// import { ReactComponent as Logo } from "./assets/bison.svg";
import { useWindowSize } from "../../src/components/hooks/useWindowSize";
import { useRouter } from "next/router";

export default function OtherUsernameConversationPage() {
  const windowSize = useWindowSize();

  const router = useRouter();
  const { otherUsername } = router.query;

  return (
    <div className="relative">
      {/* wide screens get conversations and detailview */}
      {windowSize.width >= 640 && (
        <div className="flex w-full justify-between">
          <section className="mt-[100px] overflow-y-auto flex-grow-0 sm:max-w-xs flex-shrink-0 flex flex-col min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)]">
            <ConversationList />
          </section>
          <section className="relative overflow-y-scroll flex flex-col flex-grow min-h-[calc(100vh-100px)] max-h-[calc(100vh)]">
            <div className="mt-[100px]"></div>
            <MessageList />
            <div className="mb-[100px]"></div>
            <div className="fixed bottom-0 right-0 p-4 backdrop-blur-sm h-20 w-1/2">
              <MessageInput recipient={otherUsername} />
            </div>
          </section>
        </div>
      )}
      {/* small screen only gets specific conversation */}
      {windowSize.width < 640 && (
        <section className="flex-grow flex flex-col mt-[100px]">
          <MessageList />
          <div className="w-full p-4 bg-gray-100 bg-opacity-75 rounded-lg fixed bottom-0">
            <MessageInput recipient={otherUsername} />
          </div>
        </section>
      )}
    </div>
  );
}
