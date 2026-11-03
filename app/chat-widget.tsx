'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'Hi! I can help you explore our products and explain how to request a quote. What can I help with?' }]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, busy]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = text.trim();
    if (!content || busy) return;
    const next = [...messages, { role: 'user' as const, content }];
    setMessages(next); setText(''); setBusy(true); setError('');
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next.slice(-8) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Please try again.');
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
    } finally { setBusy(false); }
  }

  return <div className="chat-widget">
    {open && <section className="chat-panel" aria-label="Prime Fresh chat assistant">
      <header className="chat-header"><div><strong>Prime Fresh Assistant</strong><small>Product and quote questions</small></div><button type="button" onClick={() => setOpen(false)} aria-label="Close chat">×</button></header>
      <div className="chat-messages" ref={listRef} aria-live="polite">{messages.map((message, index) => <p key={index} className={`chat-message ${message.role}`}>{message.content}</p>)}{busy && <p className="chat-message assistant" role="status">Thinking…</p>}{error && <p className="chat-error" role="alert">{error}</p>}</div>
      <form className="chat-form" onSubmit={submit}><label className="visually-hidden" htmlFor="chat-input">Your message</label><input id="chat-input" value={text} onChange={e => setText(e.target.value)} placeholder="Ask about products…" maxLength={1000} disabled={busy}/><button type="submit" disabled={busy || !text.trim()} aria-label="Send message">Send</button></form>
      <p className="chat-disclaimer">AI responses may be imperfect. Confirm product details with the company. <a href="/privacy">Privacy</a></p>
    </section>}
    <button type="button" className="chat-launcher" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close chat assistant' : 'Chat with Prime Fresh'}>{open ? '×' : <><span aria-hidden="true">✳</span><span>Chat with us</span></>}</button>
  </div>;
}
