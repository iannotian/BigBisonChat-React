import Head from "next/head";
import React from "react";
import useSWR from "swr";

import ConversationList from "../../src/components/conversations/Conversations"; // list of convos
import { useWindowSize } from "../../src/components/hooks/useWindowSize";
import { Bison } from "../../src/components/svg/Bison";
import { Conversation } from "../../src/types";
import { ClientSideBigBisonApiService } from "../../src/utils/api/client";

const client = new ClientSideBigBisonApiService();

function ConversationsPage() {
  const windowSize = useWindowSize();

  const { data: conversationsData, error: conversationsError } = useSWR(
    "conversations",
    () => client.getConversations()
  );

  return (
    <>
      <Head>
        <title>BigBisonChat – Conversations</title>
      </Head>
      {windowSize?.width && windowSize.width >= 640 && (
        <div className="flex w-full justify-between space-x-2">
          <div className="min-h-[calc(100vh-86px)] max-h-[calc(100vh)] overflow-y-scroll sm:max-w-xs space-y-2">
            <div className="mt-[86px]"></div>
            <ConversationList
              data={conversationsData as Conversation[]}
              error={conversationsError}
            />
            <div className="mb-[86px]"></div>
          </div>
          <section className="h-screen flex-grow flex flex-col justify-around self-center">
            <Bison className="self-center my-auto text-gray-200 fill-current h-48 w-48" />
          </section>
        </div>
      )}
      {windowSize?.width && windowSize.width < 640 && (
        <div className="space-y-2 flex flex-col w-full justify-between min-h-[calc(100vh-86px)] max-h-[calc(100vh)] overflow-y-scroll">
          <div className="mt-[86px]"></div>
          <ConversationList
            data={conversationsData as Conversation[]}
            error={conversationsError}
          />
          <div className="mb-[86px]"></div>
        </div>
      )}
    </>
  );
}

export default ConversationsPage;
