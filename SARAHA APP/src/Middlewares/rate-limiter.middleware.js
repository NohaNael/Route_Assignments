
const ipReq={};
const blockedIps=new Set();

const unblockersTimer=new Map();

const RateLimit=6;
const WindowTime=2*60*1000;


export const customRateLimiter=()=>{
    return (req,res,next)=>{
        const ip=req.ip;
        console.log(ip)

        const currentTime=Date.now();

        if(blockedIps.has(ip)) throw new Error("Too many requests, try again later.");

        if(!ipReq[ip]){
            ipReq[ip]=
            {count:1, 
                startTime:currentTime};

            return next();
        }

            const difference=currentTime-ipReq[ip].startTime;
            if(difference<WindowTime){
                ipReq[ip].count+=1;
                if(ipReq[ip].count>RateLimit){
                    blockedIps.add(ip);

                if (!unblockersTimer.has(ip)) {
                    const unblocker = setTimeout(() => {
                        blockedIps.delete(ip);
                        unblockersTimer.delete(ip);
                    }, WindowTime);
                    unblockersTimer.set(ip, unblocker);
                }
                throw new Error("Too many requests, try again later.");
                }
            } else {
                ipReq[ip].count=1;
                ipReq[ip].startTime=currentTime;
            }
        
            next();
        }
          
        }

    
