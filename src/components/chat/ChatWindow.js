import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import fecha from 'fecha';
import io from 'socket.io-client';

import { baseUrl } from '../../utils/api';
import { parseJWTUserInfo } from '../../utils/Auth';

import { fetcher } from '../../utils/api.js';

import useSWR from 'swr';
import { useRouteMatch } from 'react-router-dom';
import useMutation, { mutationTypes } from '../hooks/useMutation';

function determineEventName(userOneUsername, userTwoUsername) {
  // create deterministic but unique room name between two users
  return [userOneUsername, userTwoUsername].sort().join("-");
}

function scrollToBottom(ref) {
  ref.current && ref.current.scrollIntoView({ behavior: "smooth", alignToTop: true });
}

export function ChatWithHooks() {
  const { params: { otherUsername } } = useRouteMatch('/conversations/:otherUsername');
  const prevOtherUsername = usePrevious(otherUsername);

  const { data: messagesData, error: messagesError } = useSWR(`/conversations/${otherUsername}`, fetcher);
  const { data: conversationsData } = useSWR(`/conversations`, fetcher);
  const mutateMessages = useMutation(undefined, { currentData: messagesData, type: mutationTypes.MESSAGES });
  const mutateConversations = useMutation(undefined, { currentData: conversationsData, type: mutationTypes.CONVERSATIONS, replaceUsername: otherUsername });

  const token = localStorage.getItem("id_token");
  const ownUsername = parseJWTUserInfo(token).nickname;

  const messagesEnd = useRef(null);
  
  const { current: { socket } } = useRef({ socket: io(baseUrl) });

  useEffect(() => {
    return () => {
      socket.close();
    }
  }, [socket]);

  useEffect(() => {
    const oldEventName = determineEventName(ownUsername, prevOtherUsername);
    const newEventName = determineEventName(ownUsername, otherUsername);
    socket.off(oldEventName);
    socket.on(newEventName, socketPayload => { 
      mutateMessages(`/conversations/${otherUsername}`, socketPayload);
      mutateConversations('/conversations', socketPayload);
    });

    scrollToBottom(messagesEnd);
  }, [otherUsername, prevOtherUsername, socket, mutateMessages, mutateConversations, ownUsername]);

  useEffect(() => {
    document.title = "BigBisonChat - " + otherUsername;
  }, [otherUsername]);

  return (
    <div className="flex-grow sm:overflow-y-scroll" style={{ WebkitOverflowScrolling: 'auto' }}>
        <ol className="m-2 ml-5 flex flex-col">
          { messagesData && messagesData.map(message =>
              <ChatBubble
                key={message.message_id}
                message={message}
                otherUsername={otherUsername}
              />
          )}
          { !messagesData && !messagesError &&
            <div className="m-auto ">Loading...</div>
          }
          { messagesError &&
            <div>Error!</div>
          }
        </ol>
        <div
          className="h-16 sm:h-0"
          ref={ messagesEnd }
        />
      </div>
  )
}

function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

function ChatBubble(props) {
  const { sender_username, body } = props.message;
  
  const epochTime = Date.parse(props.message.created_at);
  const timestamp = fecha.format(epochTime, 'MM/DD/YY hh:mmA');
  
  const { otherUsername } = props; 
  const isFromSender = sender_username === otherUsername;

  return (
      <li className={`max-w-xs hover:text-gray-500 transition-colors ease-out duration-200 delay-500 text-transparent ${isFromSender ? 'self-start text-left' : 'self-end text-right'}`}>
        <p className={`inline-block p-2 shadow rounded-lg w-auto ${isFromSender ? 'bg-gray-200 text-gray-700 rounded-bl-none' : 'bg-red-100 text-red-700 rounded-br-none'}`} style={{ wordBreak: 'break-word', hyphens: 'auto' }}>{body}</p>
        <time className="block text-xs">{timestamp}</time>
      </li>
  )
}

ChatBubble.propTypes = {
  message: PropTypes.shape({
    sender_username: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired
  })
}