import { useEffect, useState } from "react";
import { Loader, Heading } from "@aws-amplify/ui-react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { get } from 'aws-amplify/api';

export function LivenessQuickStart() {
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCreateLiveness = async () => {
      const response = await get({
        apiName: "liveness",
        path: "/session/create",
      }).response
      const data = await response.body.json();
      setSessionId(data.sessionId);
      setLoading(false);
    };

    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete = async () => {
    console.log("masuk kesini ga sih")
    const response = await get({ 
      apiName: 'liveness',
      path: '/session/get',
      options: {
        queryParams: {
          sessionId: sessionId
        }
      }
    }).response;
    const data = await response.body.json()
    console.log(data);

    if (data.isLive) {
      console.log(data)
      setSuccess("User is live");
      console.log("live");
    } else {
      setSuccess("User is not live");
      console.log("not live");
    }
  };

  const handleError = (error) => {
    console.log("got error", error);
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <FaceLivenessDetector
            sessionId={sessionId ?? "1"}
            region="us-east-1"
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleError}
          />
          <Heading level={2}>{success}</Heading>
        </>
      )}
    </>
  );
}
