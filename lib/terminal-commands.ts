// Simulated terminal commands
export const commands: Record<string, (args: string[]) => Promise<string>> = {
  ls: async (args: string[]) => {
    // Simulate directory listing
    const files = [
      { name: "Documents", type: "dir", color: "text-[#3399ff]" },
      { name: "Downloads", type: "dir", color: "text-[#3399ff]" },
      { name: "Pictures", type: "dir", color: "text-[#3399ff]" },
      { name: "server.js", type: "file", color: "text-white" },
      { name: "README.md", type: "file", color: "text-white" },
      { name: "package.json", type: "file", color: "text-white" },
      { name: ".env", type: "file", color: "text-[#00ff99]" },
    ]

    // Format the output
    return files
      .map((file) => `${file.type === "dir" ? "d" : "-"}rwxr-xr-x 1 user user 4096 Apr 23 14:30 ${file.name}`)
      .join("\n")
  },

  cat: async (args: string[]) => {
    if (args.length === 0) {
      throw new Error("cat: missing file operand")
    }

    const filename = args[0]

    // Simulate file contents
    const files: Record<string, string> = {
      "README.md":
        "# Project Documentation\n\nThis is a sample README file for the project.\n\n## Getting Started\n\nRun `npm install` to install dependencies.",
      "server.js":
        'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Hello World!");\n});\n\napp.listen(3000, () => {\n  console.log("Server running on port 3000");\n});',
      ".env": "PORT=3000\nNODE_ENV=development\nAPI_KEY=your_api_key_here",
      "package.json":
        '{\n  "name": "project",\n  "version": "1.0.0",\n  "description": "A sample project",\n  "main": "server.js",\n  "scripts": {\n    "start": "node server.js"\n  },\n  "dependencies": {\n    "express": "^4.17.1"\n  }\n}',
    }

    if (files[filename]) {
      return files[filename]
    } else {
      throw new Error(`cat: ${filename}: No such file or directory`)
    }
  },

  ps: async () => {
    // Simulate process list
    return (
      "  PID TTY          TIME CMD\n" +
      "  123 pts/0    00:00:01 bash\n" +
      "  456 pts/0    00:00:00 ps\n" +
      "  789 pts/0    00:01:23 node\n" +
      " 1024 pts/0    00:00:05 nginx\n" +
      " 2048 pts/0    00:00:12 mongod"
    )
  },

  top: async () => {
    // Simulate top command output
    return (
      "top - 14:30:45 up 23 days, 21:52, 1 user, load average: 0.08, 0.03, 0.01\n" +
      "Tasks: 128 total,   1 running, 127 sleeping,   0 stopped,   0 zombie\n" +
      "%Cpu(s):  2.0 us,  1.0 sy,  0.0 ni, 96.9 id,  0.0 wa,  0.0 hi,  0.1 si,  0.0 st\n" +
      "MiB Mem :  16096.0 total,   8123.2 free,   2204.5 used,   5768.3 buff/cache\n" +
      "MiB Swap:   4096.0 total,   4096.0 free,      0.0 used.  13891.5 avail Mem\n\n" +
      "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n" +
      "  789 user      20   0  712540  58320  13492 S   2.0   0.4   1:23.45 node\n" +
      " 1024 www-data  20   0   14212   4952   3260 S   0.3   0.1   0:05.32 nginx\n" +
      " 2048 mongodb   20   0  983540 102340  12104 S   1.7   0.6   0:12.18 mongod\n" +
      "  123 user      20   0   10124   3312   1580 S   0.0   0.0   0:01.05 bash"
    )
  },

  neofetch: async () => {
    // ASCII art for neofetch
    return `
            .-/+oossssoo+/-.               user@server
        \`:+ssssssssssssssssss+:\`           -------------
      -+ssssssssssssssssssyyssss+-         OS: Ubuntu 22.04.3 LTS x86_64
    .ossssssssssssssssssdMMMNysssso.       Kernel: 5.15.0-91-generic
   /ssssssssssshdmmNNmmyNMMMMhssssss/      Uptime: 23 days, 21 hours, 52 mins
  +ssssssssshmydMMMMMMMNddddyssssssss+     Packages: 1832 (dpkg)
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Shell: bash 5.1.16
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   Terminal: xterm-256color
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   CPU: Intel i7-9700K (8) @ 3.60GHz
ossssssssshNMMMyhhyyyyhdNMMMNhssssssss/    GPU: NVIDIA GeForce RTX 3080
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   Memory: 16384MiB / 32768MiB
 +sssssssshNMMMyhhyyyyhdNMMMNhssssssss+    Disk: 512GB SSD + 2TB HDD
  /ssssssssshmydMMMMMMMNddddyssssssss/     Network: 1000Mbps Ethernet
   /ssssssssssshdmNNNNmyNMMMMhssssss/      Local IP: 192.168.1.100
    .ossssssssssssssssssdMMMNysssso.       Public IP: 203.0.113.42
      -+sssssssssssssssssyyyssss+-         
        \`:+ssssssssssssssssss+:\`           
            .-/+oossssoo+/-.               
`
  },

  cd: async (args: string[]) => {
    // Simulate changing directory
    if (args.length === 0 || args[0] === "~") {
      return "Changed directory to: ~"
    }

    const validDirs = ["Documents", "Downloads", "Pictures"]
    const dir = args[0]

    if (validDirs.includes(dir)) {
      return `Changed directory to: ~/${dir}`
    } else {
      throw new Error(`cd: ${dir}: No such file or directory`)
    }
  },
}
