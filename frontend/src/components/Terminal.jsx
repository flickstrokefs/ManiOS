import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Sparkles, Send, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SYSTEM_DATA } from '../data/systemData';
import { sfx } from '../sound/sfx';

export default function Terminal({ onExit, onOpenWindow }) {
  const [history, setHistory] = useState([
    {
      id: 1,
      type: 'output',
      content: (
        <div>
          <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>
            Welcome to {SYSTEM_DATA.osName} Terminal v{SYSTEM_DATA.version}
          </span>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Interactive Unix shell • Type <b style={{ color: 'var(--accent-green)' }}>help</b> or click any command below to begin.
          </div>
        </div>
      )
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalBodyRef = useRef(null);

  const commandList = [
    'help', 'about', 'memories', 'whoami', 'manistory',
    'credits', 'sudo laugh', 'uname -a', 'confetti', 'clear', 'exit'
  ];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (rawCommand) => {
    const cmd = rawCommand.trim().toLowerCase();
    sfx.playCommandExecute();

    if (!cmd) return;

    // Add to command history
    setCmdHistory((prev) => [...prev, rawCommand]);
    setHistoryIndex(-1);

    // Push user's input line to output history
    const userLine = {
      id: Date.now(),
      type: 'input',
      content: cmd
    };

    let responseContent = null;

    switch (cmd) {
      case 'help':
        responseContent = (
          <div style={{ color: 'var(--text-main)', lineHeight: '1.8' }}>
            <div style={{ color: 'var(--accent-green)', fontWeight: 700, marginBottom: '0.4rem' }}>
              Available Terminal Commands:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.4rem' }}>
              <div><b style={{ color: 'var(--accent-cyan)' }}>about</b> → reveals something sweet</div>
              <div><b style={{ color: 'var(--accent-cyan)' }}>memories</b> → shared milestones & logs</div>
              <div><b style={{ color: 'var(--accent-cyan)' }}>whoami</b> → profile verification</div>
              <div><b style={{ color: 'var(--accent-cyan)' }}>manistory</b> → the origin story</div>
              <div><b style={{ color: 'var(--accent-cyan)' }}>sudo laugh</b> → humor protocol</div>
              <div><b style={{ color: 'var(--accent-cyan)' }}>credits</b> → developer & version details</div>
              <div><b style={{ color: 'var(--accent-cyan)' }}>uname -a</b> → kernel specifications</div>
              <div><b style={{ color: 'var(--accent-cyan)' }}>confetti</b> → trigger birthday celebration</div>
              <div><b style={{ color: 'var(--accent-cyan)' }}>clear</b> → clears the terminal</div>
              <div><b style={{ color: 'var(--accent-cyan)' }}>exit</b> → system shutdown</div>
            </div>
          </div>
        );
        break;

      case 'about':
        responseContent = (
          <div style={{ borderLeft: '3px solid var(--accent-green)', paddingLeft: '0.8rem', color: '#c5c8c6', lineHeight: '1.8' }}>
            {SYSTEM_DATA.quotes.about.map((line, idx) => (
              <p key={idx} style={{ color: idx === 0 ? 'var(--accent-green)' : 'inherit', margin: '0.2rem 0' }}>
                &gt; {line}
              </p>
            ))}
          </div>
        );
        break;

      case 'memories':
        responseContent = (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ color: 'var(--accent-green)', fontWeight: 700 }}>
              &gt; Shared System Logs Archive:
            </div>
            {SYSTEM_DATA.memories.map((m, idx) => (
              <div key={idx} style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.5rem 0.8rem', borderRadius: '4px', borderLeft: '2px solid var(--accent-cyan)' }}>
                <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>• {m.year}</span> [{m.tag}]: {m.description}
              </div>
            ))}
          </div>
        );
        break;

      case 'whoami':
        responseContent = (
          <div style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
            &gt; {SYSTEM_DATA.quotes.whoami.main}
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              {SYSTEM_DATA.quotes.whoami.subtext}
            </div>
          </div>
        );
        break;

      case 'manistory':
        responseContent = (
          <div style={{ fontStyle: 'italic', color: '#d1fae5', lineHeight: '1.8', borderLeft: '3px solid var(--accent-cyan)', paddingLeft: '0.8rem' }}>
            {SYSTEM_DATA.story.map((s, idx) => (
              <div key={idx}>{s}</div>
            ))}
          </div>
        );
        break;

      case 'sudo laugh':
        responseContent = (
          <div style={{ color: 'var(--accent-amber)' }}>
            {SYSTEM_DATA.quotes.humor.header}<br />
            <span style={{ color: 'var(--accent-green)' }}>{SYSTEM_DATA.quotes.humor.reply}</span>
          </div>
        );
        break;

      case 'credits':
        responseContent = (
          <div style={{ lineHeight: '1.7', color: 'var(--text-main)' }}>
            <div>&gt; Project: <b style={{ color: 'var(--accent-green)' }}>{SYSTEM_DATA.quotes.credits.project}</b></div>
            <div>&gt; Developer: <b style={{ color: 'var(--accent-cyan)' }}>{SYSTEM_DATA.quotes.credits.developer}</b></div>
            <div>&gt; Architecture: {SYSTEM_DATA.quotes.credits.architecture}</div>
            <div>&gt; Dedicated to: {SYSTEM_DATA.quotes.credits.dedication}</div>
          </div>
        );
        break;

      case 'uname -a':
        responseContent = (
          <div style={{ color: 'var(--accent-green)' }}>
            &gt; {SYSTEM_DATA.quotes.uname}
          </div>
        );
        break;

      case 'confetti':
        sfx.playSuccess();
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        } catch {}
        responseContent = (
          <div style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} /> Birthday celebration protocol executed! 🎉
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputValue('');
        return;

      case 'exit':
        setHistory((prev) => [
          ...prev,
          userLine,
          {
            id: Date.now() + 1,
            type: 'output',
            content: (
              <div style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>
                {SYSTEM_DATA.quotes.shutdown}
              </div>
            )
          }
        ]);
        setInputValue('');
        setTimeout(() => {
          onExit();
        }, 1200);
        return;

      default:
        sfx.playError();
        responseContent = (
          <div style={{ color: 'var(--accent-rose)' }}>
            Command not found: <b>{cmd}</b>. Type <b style={{ color: 'var(--accent-green)' }}>help</b> for supported commands.
          </div>
        );
    }

    setHistory((prev) => [
      ...prev,
      userLine,
      {
        id: Date.now() + 1,
        type: 'output',
        content: responseContent
      }
    ]);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputValue);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputValue(cmdHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < cmdHistory.length) {
        setHistoryIndex(nextIndex);
        setInputValue(cmdHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInputValue('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputValue.trim().toLowerCase();
      if (!current) return;
      const match = commandList.find((c) => c.startsWith(current));
      if (match) {
        setInputValue(match);
        sfx.playKeyClick();
      }
    } else {
      sfx.playKeyClick();
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        background: 'rgba(9, 13, 20, 0.88)'
      }}
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      {/* Terminal Title Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1rem',
          background: 'rgba(18, 24, 38, 0.95)',
          borderBottom: '1px solid var(--border-color)',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
            {SYSTEM_DATA.profile.handle}: {SYSTEM_DATA.systemConfig.workingDirectory} (zsh)
          </span>
        </div>

        <button
          className="cyber-btn cyber-btn-ghost"
          onClick={(e) => {
            e.stopPropagation();
            setHistory([]);
          }}
          title="Clear Terminal"
          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
        >
          <RotateCcw size={13} />
          Clear
        </button>
      </div>

      {/* Quick Action Command Chips */}
      <div
        style={{
          padding: '0.45rem 1rem',
          background: 'rgba(0, 0, 0, 0.25)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.2rem' }}>
          QUICK EXEC:
        </span>
        {['about', 'memories', 'whoami', 'manistory', 'sudo laugh', 'confetti'].map((chip) => (
          <button
            key={chip}
            className="cyber-btn cyber-btn-ghost"
            style={{
              padding: '0.18rem 0.55rem',
              fontSize: '0.74rem',
              borderRadius: '999px',
              border: '1px solid rgba(0, 255, 157, 0.2)'
            }}
            onClick={() => handleCommand(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Terminal Output Scroll Body */}
      <div
        ref={terminalBodyRef}
        style={{
          flex: 1,
          padding: '1.25rem 1.5rem',
          overflowY: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.86rem, 1.6vw, 0.98rem)',
          lineHeight: '1.65'
        }}
      >
        {history.map((entry) => (
          <div key={entry.id} style={{ marginBottom: '0.9rem' }}>
            {entry.type === 'input' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{SYSTEM_DATA.systemConfig.shellPrompt}</span>
                <span style={{ color: '#fff' }}>{entry.content}</span>
              </div>
            ) : (
              <div style={{ marginTop: '0.25rem' }}>{entry.content}</div>
            )}
          </div>
        ))}

        {/* Current Active Input Line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
          <span style={{ color: 'var(--accent-green)', fontWeight: 600, userSelect: 'none' }}>{SYSTEM_DATA.systemConfig.shellPrompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
            spellCheck="false"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'inherit',
              padding: 0
            }}
          />
        </div>
      </div>
    </div>
  );
}
