import { useEffect, useState } from "react";
import {
  Loader,
} from "@aws-amplify/ui-react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { get } from "aws-amplify/api";
import ReferenceImage from "./ReferenceImage";

export function LivenessQuickStart() {
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [faceLivenessAnalysis, setFaceLivenessAnalysis] = useState(null);

  useEffect(() => {
    const fetchCreateLiveness = async () => {
      const response = await get({
        apiName: "liveness",
        path: "/session/create",
      }).response;
      const data = await response.body.json();
      setSessionId(data.sessionId);
      setLoading(false);
    };

    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete = async () => {
    const response = await get({
      apiName: "liveness",
      path: "/session/get",
      options: {
        queryParams: {
          sessionId: sessionId,
        },
      },
    }).response;
    const data = await response.body.json();
    setFaceLivenessAnalysis(data.response);
  };

  const handleError = (error) => {
    console.log("got error", error);
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : faceLivenessAnalysis ? (
        <ReferenceImage
          faceLivenessAnalysis={faceLivenessAnalysis}
        ></ReferenceImage>
      ) : (
        <>
          <FaceLivenessDetector
            sessionId={sessionId ?? "1"}
            region="us-east-1"
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleError}
          />
        </>
      )}
    </>
  );
}
