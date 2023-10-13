
export const time = (createdAt) => {
  const currentTime = new Date();
  const postDate = new Date(createdAt);
    const timeAgo = currentTime - postDate; //time ago in miliseconds
    let postedAt;

     const secs = Math.floor(timeAgo / 1000);
                const mins = Math.floor(secs / 60);
                const hrs = Math.floor(mins / 60);
                const days = Math.floor(hrs / 24);
                const wks = Math.floor(days / 7);
                const months = Math.floor(wks / 4);
                const yrs = Math.floor(months / 12);

                switch (true) {
                  case yrs > 0:
                    postedAt = `${yrs} yr${yrs > 1 ? 's' : ''} ago`;
                    break;
                  case months > 0:
                    postedAt = `${months} month${months > 0 ? 's' : ''} ago`;
                    break;
                  case wks > 0:
                    postedAt = `${wks} week${wks > 1 ? 's' : ''} ago`;
                    break;
                  case days > 0:
                    postedAt = `${days} day${days > 1 ? 's' : ''} ago`;
                    break;
                  case hrs > 0:
                    postedAt = `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
                    break;
                  case mins > 0:
                    postedAt = `${mins} min${mins > 1 ? 's' : ''} ago`;
                    break;
                  case secs > 0:
                    postedAt = `${secs} sec${secs > 1 ? 's' : ''} ago`;
                    break;
                  default:
                    postedAt = `just now`;
                    break;
    };
    return  postedAt ;

}