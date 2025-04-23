import type { Process, ResourceData } from "./types"

// Generate dummy process data
export const processes: Process[] = [
  { pid: 1, user: "root", command: "/sbin/init", cpu: 0.1, memory: 0.3 },
  { pid: 2, user: "root", command: "[kthreadd]", cpu: 0.0, memory: 0.0 },
  { pid: 3, user: "root", command: "[rcu_gp]", cpu: 0.0, memory: 0.0 },
  { pid: 7, user: "root", command: "[kworker/0:0H-events_highpri]", cpu: 0.0, memory: 0.0 },
  { pid: 9, user: "root", command: "[mm_percpu_wq]", cpu: 0.0, memory: 0.0 },
  { pid: 10, user: "root", command: "[ksoftirqd/0]", cpu: 0.2, memory: 0.0 },
  { pid: 11, user: "root", command: "[rcu_sched]", cpu: 0.3, memory: 0.0 },
  { pid: 12, user: "root", command: "[migration/0]", cpu: 0.0, memory: 0.0 },
  { pid: 14, user: "root", command: "[cpuhp/0]", cpu: 0.0, memory: 0.0 },
  { pid: 15, user: "root", command: "[cpuhp/1]", cpu: 0.0, memory: 0.0 },
  { pid: 16, user: "root", command: "[migration/1]", cpu: 0.0, memory: 0.0 },
  { pid: 17, user: "root", command: "[ksoftirqd/1]", cpu: 0.1, memory: 0.0 },
  { pid: 19, user: "root", command: "[kworker/1:0H-events_highpri]", cpu: 0.0, memory: 0.0 },
  { pid: 20, user: "root", command: "[kdevtmpfs]", cpu: 0.0, memory: 0.0 },
  { pid: 21, user: "root", command: "[netns]", cpu: 0.0, memory: 0.0 },
  { pid: 22, user: "root", command: "[kauditd]", cpu: 0.0, memory: 0.0 },
  { pid: 23, user: "root", command: "[khungtaskd]", cpu: 0.0, memory: 0.0 },
  { pid: 24, user: "root", command: "[oom_reaper]", cpu: 0.0, memory: 0.0 },
  { pid: 25, user: "root", command: "[writeback]", cpu: 0.0, memory: 0.0 },
  { pid: 26, user: "root", command: "[kcompactd0]", cpu: 0.0, memory: 0.0 },
  { pid: 27, user: "root", command: "[ksmd]", cpu: 0.0, memory: 0.0 },
  { pid: 28, user: "root", command: "[khugepaged]", cpu: 0.0, memory: 0.0 },
  { pid: 125, user: "root", command: "[kintegrityd]", cpu: 0.0, memory: 0.0 },
  { pid: 126, user: "root", command: "[kblockd]", cpu: 0.0, memory: 0.0 },
  { pid: 127, user: "root", command: "[blkcg_punt_bio]", cpu: 0.0, memory: 0.0 },
  { pid: 128, user: "root", command: "[tpm_dev_wq]", cpu: 0.0, memory: 0.0 },
  { pid: 129, user: "root", command: "[ata_sff]", cpu: 0.0, memory: 0.0 },
  { pid: 130, user: "root", command: "[md]", cpu: 0.0, memory: 0.0 },
  { pid: 131, user: "root", command: "[edac-poller]", cpu: 0.0, memory: 0.0 },
  { pid: 132, user: "root", command: "[devfreq_wq]", cpu: 0.0, memory: 0.0 },
  { pid: 133, user: "root", command: "[watchdogd]", cpu: 0.0, memory: 0.0 },
  { pid: 136, user: "root", command: "[kswapd0]", cpu: 0.1, memory: 0.0 },
  { pid: 137, user: "root", command: "[ecryptfs-kthrea]", cpu: 0.0, memory: 0.0 },
  { pid: 179, user: "root", command: "[kthrotld]", cpu: 0.0, memory: 0.0 },
  { pid: 180, user: "root", command: "[acpi_thermal_pm]", cpu: 0.0, memory: 0.0 },
  { pid: 182, user: "root", command: "[scsi_eh_0]", cpu: 0.0, memory: 0.0 },
  { pid: 183, user: "root", command: "[scsi_tmf_0]", cpu: 0.0, memory: 0.0 },
  { pid: 184, user: "root", command: "[scsi_eh_1]", cpu: 0.0, memory: 0.0 },
  { pid: 185, user: "root", command: "[scsi_tmf_1]", cpu: 0.0, memory: 0.0 },
  { pid: 186, user: "root", command: "[vfio-irqfd-clea]", cpu: 0.0, memory: 0.0 },
  { pid: 187, user: "root", command: "[ipv6_addrconf]", cpu: 0.0, memory: 0.0 },
  { pid: 196, user: "root", command: "[kworker/0:1H-kblockd]", cpu: 0.0, memory: 0.0 },
  { pid: 197, user: "root", command: "[kworker/1:1H-kblockd]", cpu: 0.0, memory: 0.0 },
  { pid: 198, user: "root", command: "[kstrp]", cpu: 0.0, memory: 0.0 },
  { pid: 214, user: "root", command: "[charger_manager]", cpu: 0.0, memory: 0.0 },
  { pid: 284, user: "root", command: "[sshd]", cpu: 0.2, memory: 1.2 },
  { pid: 285, user: "root", command: "/usr/sbin/cron -f", cpu: 0.1, memory: 0.3 },
  { pid: 287, user: "root", command: "/usr/bin/python3 /usr/bin/networkd-dispatcher", cpu: 0.3, memory: 1.5 },
  { pid: 288, user: "root", command: "/usr/libexec/polkitd", cpu: 0.1, memory: 2.1 },
  { pid: 289, user: "root", command: "/usr/sbin/rsyslogd -n -iNONE", cpu: 0.1, memory: 0.6 },
  { pid: 290, user: "root", command: "/usr/lib/snapd/snapd", cpu: 0.5, memory: 3.8 },
  { pid: 291, user: "root", command: "/lib/systemd/systemd-logind", cpu: 0.0, memory: 0.7 },
  { pid: 292, user: "root", command: "/usr/lib/udisks2/udisksd", cpu: 0.1, memory: 1.2 },
  { pid: 293, user: "root", command: "/sbin/wpa_supplicant -u -s -O /run/wpa_supplicant", cpu: 0.0, memory: 0.5 },
  { pid: 319, user: "root", command: "/usr/sbin/apache2 -k start", cpu: 0.3, memory: 2.1 },
  { pid: 320, user: "www-data", command: "/usr/sbin/apache2 -k start", cpu: 0.2, memory: 2.0 },
  { pid: 322, user: "www-data", command: "/usr/sbin/apache2 -k start", cpu: 0.2, memory: 1.9 },
  { pid: 323, user: "mysql", command: "/usr/sbin/mysqld", cpu: 1.2, memory: 8.5 },
  {
    pid: 365,
    user: "root",
    command: "/usr/bin/python3 /usr/share/unattended-upgrades/unattended-upgrade-shutdown",
    cpu: 0.0,
    memory: 0.9,
  },
  { pid: 403, user: "user", command: "bash", cpu: 0.1, memory: 0.5 },
  { pid: 410, user: "user", command: "vim server.js", cpu: 0.3, memory: 1.2 },
  { pid: 415, user: "user", command: "node server.js", cpu: 4.5, memory: 5.8 },
  { pid: 502, user: "user", command: "top", cpu: 0.7, memory: 0.9 },
]

// Generate dummy CPU data
const generateTimeData = (count: number, baseValue: number, variance: number): ResourceData[] => {
  const data: ResourceData[] = []
  const now = new Date()

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5000)
    const value = Math.max(0, Math.min(100, baseValue + (Math.random() * variance * 2 - variance)))

    data.push({
      time: time.toLocaleTimeString(),
      value,
    })
  }

  return data
}

export const cpuData = generateTimeData(20, 25, 15)
export const memoryData = generateTimeData(20, 45, 5)
