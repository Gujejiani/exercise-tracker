// the node program that captures local performance data
// and sends it via socket to the server 
// req:

const os = require('os');


const  getCPULoad =()=>{

    return new Promise((resolve, reject) => {
        const start = cpuAverage(); // "now" value of load
        setTimeout(() => {
            const end = cpuAverage();
            const idleDifference = end.idle - start.idle;
            const totalDifference = end.total - start.total;
            // calc the % of used cpu
            const percentageCPU = 100 - Math.floor(100 * idleDifference / totalDifference);
            resolve(percentageCPU);
        }, 100);
    });
}

const performanceLoadData = async ()=> new Promise(async (resolve, reject) => {





// what we need to know from node about the operating system performance?
// CPU load (current)
const cpus = os.cpus();
// Memory usage (free, total)
  // - total
  const totalMem = os.totalmem();
  // - free
  const freeMem = os.freemem();
  //- memory usage
    const usedMem = totalMem - freeMem;
    const memUsage = Math.floor(usedMem / totalMem * 100) / 100; // 2 decimal places 
 
// OS Type
const osType = os.type()=== 'Darwin' ? 'Mac' : os.type();

// uptime
const uptime    = os.uptime();

// CPU info

  // - Type
  const cpuType = cpus[0].model;

  // - Number of Cores
    const numCores = cpus.length;
  // - Clock Speed
    const cpuSpeed = cpus[0].speed;
    const cpuLoad = await getCPULoad();
    resolve ({
        freeMem,
        totalMem,
        usedMem,
        memUsage,
        osType,
        uptime,
        cpuType,
        numCores,
        cpuSpeed,
        cpuLoad
        
    

    })
});


    function cpuAverage(){
        const cpus = os.cpus();
        // get ms in each mode, BUT this number is since reboot
        // so get it now, and get it in 100ms and compare
        let idleMs = 0;
        let totalMs = 0;
        // loop through each core
        cpus.forEach((aCore) => {
            // loop through each property of the current core (thread)
            for(mode in aCore.times){
            totalMs += aCore.times[mode];
            }
            idleMs += aCore.times.idle;
        });
        return {
            idle: idleMs / cpus.length,
            total: totalMs / cpus.length
        }
    }
 




performanceLoadData().then((data) => {
    console.log(data)
})
