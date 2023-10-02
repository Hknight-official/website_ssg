import React, { useState, useEffect } from 'react';
import '../../assets/css/auth/components/LiveView.css';

const LiveView = ({ data }) => {
    const [current, setCurrent] = useState(0);
    const [content, setContent] = useState('');
    const [canRender, setCanRender] = useState(true);
    const [showTitle, setShowTitle] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            if (canRender && data && data[current] && data[current].title && data[current].content) {
                const { title, content } = data[current];
                const text = `${title}\n\n${content}`;
                setContent(text);
                setCurrent((current + 1) % data.length);
                setCanRender(false);
                setShowTitle(false);
                setTimeout(() => {
                    setCanRender(true);
                    setShowTitle(true);
                    setContent('');
                }, 15000);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [data, current, canRender]);
    const renderText = () => {
        return content.split('').map((char, index) => (
            <span
                key={index}
                className="typed-char"
                style={{
                    animationDelay: `${index * 100}ms`,
                }}
            >
        {char === '\n' ? <br /> : char}
      </span>
        ));
    };

    return (
        <div className="live-view-container d-flex align-items-center justify-content-center">
            {showTitle && <div className={"p-4 m-3"}><h1 className={"brand"}>School Psychology for Future </h1></div>}
            <div className="live-view-content">{renderText()}</div>
        </div>
    );
};

export default LiveView;