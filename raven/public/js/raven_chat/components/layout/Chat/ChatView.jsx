import React, { useEffect } from 'react';
import ChatInput from './ChatInput/ChatInput';
import MessageStream from './MessageStream/MessageStream';

const ChatView = ({ selectedChannel }) => {
    const [show, setShow] = React.useState(!!selectedChannel);
    const [refreshKey, setRefreshKey] = React.useState(0); 

    useEffect(() => {
        if (!selectedChannel) {
            setTimeout(() => {
                setShow(false);
            }, 300);
        } else {
            setShow(true);
        }
    }, [selectedChannel]);

    const sendMessage = (text) => {
        const content = text.trim();

        if (content.length === 0) return;

        frappe.call('raven.api.raven_message.send_message', {
            channel_id: selectedChannel,
            text: content,
            json_content: {
                content: [
                    {
                        content: [
                            {
                                text: content,
                                type: 'text',
                            },
                        ],
                        type: 'paragraph',
                    },
                ],
                type: 'doc',
            },
            is_reply: false,
        }).then(() => {
            setRefreshKey((prevKey) => prevKey + 1); 
        });
    };

    return (
        <div className={`raven-chat-view`}>
            {show && (
                <div className='raven-chat-view-container'>
                    <MessageStream key={refreshKey} channelID={selectedChannel} />
                    <ChatInput sendMessage={sendMessage} />
                </div>
            )}
        </div>
    );
};

export default ChatView;
