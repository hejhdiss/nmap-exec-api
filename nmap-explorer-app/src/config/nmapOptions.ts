// Nmap options organized by category based on backend main.py

export interface NmapOption {
  id: number;
  flag: string;
  needsInput: boolean;
  inputKey?: string;
  description: string;
  placeholder?: string;
}

export interface OptionCategory {
  name: string;
  icon: string;
  options: NmapOption[];
}

export const TARGET_SPEC: NmapOption[] = [
  { id: 1, flag: "-iL", needsInput: true, inputKey: "input_file", description: "Input from list of hosts/networks", placeholder: "hostlist.txt" },
  { id: 2, flag: "-iR", needsInput: true, inputKey: "random_hosts", description: "Choose random targets", placeholder: "10" },
  { id: 3, flag: "--exclude", needsInput: true, inputKey: "exclude_hosts", description: "Exclude hosts/networks", placeholder: "192.168.1.1,192.168.1.2" },
  { id: 4, flag: "--excludefile", needsInput: true, inputKey: "exclude_file", description: "Exclude list from file", placeholder: "exclude.txt" },
];

export const HOST_DISCOVERY: NmapOption[] = [
  { id: 10, flag: "-sL", needsInput: false, description: "List Scan - simply list targets to scan" },
  { id: 11, flag: "-sn", needsInput: false, description: "Ping Scan - disable port scan" },
  { id: 12, flag: "-Pn", needsInput: false, description: "Treat all hosts as online - skip host discovery" },
  { id: 13, flag: "-PS", needsInput: true, inputKey: "tcp_syn_ports", description: "TCP SYN discovery to given ports", placeholder: "22,80,443" },
  { id: 14, flag: "-PA", needsInput: true, inputKey: "tcp_ack_ports", description: "TCP ACK discovery to given ports", placeholder: "80,443" },
  { id: 15, flag: "-PU", needsInput: true, inputKey: "udp_ports", description: "UDP discovery to given ports", placeholder: "53,161" },
  { id: 16, flag: "-n", needsInput: false, description: "Never do DNS resolution" },
  { id: 17, flag: "-R", needsInput: false, description: "Always resolve DNS" },
  { id: 18, flag: "--dns-servers", needsInput: true, inputKey: "dns_servers", description: "Specify custom DNS servers", placeholder: "8.8.8.8,8.8.4.4" },
  { id: 19, flag: "--traceroute", needsInput: false, description: "Trace hop path to each host" },
];

export const SCAN_TECHNIQUES: NmapOption[] = [
  { id: 30, flag: "-sS", needsInput: false, description: "TCP SYN scan (Stealth)" },
  { id: 31, flag: "-sT", needsInput: false, description: "TCP connect scan" },
  { id: 32, flag: "-sA", needsInput: false, description: "TCP ACK scan" },
  { id: 33, flag: "-sW", needsInput: false, description: "TCP Window scan" },
  { id: 34, flag: "-sM", needsInput: false, description: "TCP Maimon scan" },
  { id: 35, flag: "-sU", needsInput: false, description: "UDP scan" },
  { id: 36, flag: "-sN", needsInput: false, description: "TCP Null scan" },
  { id: 37, flag: "-sF", needsInput: false, description: "TCP FIN scan" },
  { id: 38, flag: "-sX", needsInput: false, description: "TCP Xmas scan" },
  { id: 39, flag: "--scanflags", needsInput: true, inputKey: "tcp_flags", description: "Customize TCP scan flags", placeholder: "URGACKPSHRSTSYNFIN" },
  { id: 40, flag: "-sI", needsInput: true, inputKey: "zombie_host", description: "Idle scan (zombie host)", placeholder: "zombie.host.com" },
];

export const PORT_SPEC: NmapOption[] = [
  { id: 50, flag: "-p", needsInput: true, inputKey: "ports", description: "Only scan specified ports", placeholder: "22,80,443 or 1-1000" },
  { id: 51, flag: "--exclude-ports", needsInput: true, inputKey: "exclude_ports", description: "Exclude specified ports", placeholder: "135,139,445" },
  { id: 52, flag: "-F", needsInput: false, description: "Fast mode - scan fewer ports than default" },
  { id: 53, flag: "-r", needsInput: false, description: "Scan ports sequentially - don't randomize" },
  { id: 54, flag: "--top-ports", needsInput: true, inputKey: "top_ports", description: "Scan <number> most common ports", placeholder: "100" },
];

export const SERVICE_VERSION: NmapOption[] = [
  { id: 70, flag: "-sV", needsInput: false, description: "Probe open ports to determine service/version info" },
  { id: 71, flag: "--version-intensity", needsInput: true, inputKey: "intensity", description: "Set version scan intensity (0-9)", placeholder: "7" },
  { id: 72, flag: "--version-light", needsInput: false, description: "Limit to most likely probes (intensity 2)" },
  { id: 73, flag: "--version-all", needsInput: false, description: "Try every single probe (intensity 9)" },
  { id: 74, flag: "--version-trace", needsInput: false, description: "Show detailed version scan activity" },
];

export const OS_DETECTION: NmapOption[] = [
  { id: 90, flag: "-O", needsInput: false, description: "Enable OS detection" },
  { id: 91, flag: "--osscan-limit", needsInput: false, description: "Limit OS detection to promising targets" },
  { id: 92, flag: "--osscan-guess", needsInput: false, description: "Guess OS more aggressively" },
];

export const TIMING: NmapOption[] = [
  { id: 110, flag: "-T", needsInput: true, inputKey: "timing_template", description: "Set timing template (0-5)", placeholder: "4" },
  { id: 111, flag: "--host-timeout", needsInput: true, inputKey: "timeout", description: "Give up on target after this time", placeholder: "30m" },
  { id: 112, flag: "--min-rate", needsInput: true, inputKey: "min_rate", description: "Send packets no slower than <number>/sec", placeholder: "100" },
  { id: 113, flag: "--max-rate", needsInput: true, inputKey: "max_rate", description: "Send packets no faster than <number>/sec", placeholder: "1000" },
];

export const OUTPUT_OPTIONS: NmapOption[] = [
  { id: 150, flag: "-oN", needsInput: true, inputKey: "normal_output", description: "Normal output to file", placeholder: "scan_result" },
  { id: 151, flag: "-oX", needsInput: true, inputKey: "xml_output", description: "XML output to file", placeholder: "scan_result" },
  { id: 152, flag: "-oA", needsInput: true, inputKey: "all_outputs", description: "Output in all formats", placeholder: "scan_result" },
  { id: 153, flag: "-v", needsInput: false, description: "Increase verbosity level" },
  { id: 154, flag: "--open", needsInput: false, description: "Only show open ports" },
];

export const OPTION_CATEGORIES: OptionCategory[] = [
  { name: "Target Specification", icon: "🎯", options: TARGET_SPEC },
  { name: "Host Discovery", icon: "🔍", options: HOST_DISCOVERY },
  { name: "Scan Techniques", icon: "⚡", options: SCAN_TECHNIQUES },
  { name: "Port Specification", icon: "🚪", options: PORT_SPEC },
  { name: "Service/Version Detection", icon: "🔬", options: SERVICE_VERSION },
  { name: "OS Detection", icon: "💻", options: OS_DETECTION },
  { name: "Timing & Performance", icon: "⏱️", options: TIMING },
];

// Output options are handled separately due to mutual exclusivity
export const OUTPUT_FILE_OPTIONS = OUTPUT_OPTIONS.filter(o => [150, 151, 152].includes(o.id));
export const OUTPUT_EXTRA_OPTIONS = OUTPUT_OPTIONS.filter(o => [153, 154].includes(o.id));
