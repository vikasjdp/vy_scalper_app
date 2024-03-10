import { VyApi } from "@/lib/VyApi";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import AddScript from "./AddScript";
import Scripts from "./Scripts";

const Watchlist = ({
  vy,
  index,
  ws,
}: {
  vy: VyApi;
  index: string;
  ws: WebSocket;
}) => {
  const { ceScript, peScript } = useSelector(
    (store: RootState) => store.watchlist
  );
  return (
    <div className="flex flex-col sm:flex-row justify-around items-center p-4 gap-2">
      {ceScript ? (
        <Scripts optt="CE" index={index} vy={vy} script={ceScript} ws={ws} />
      ) : (
        <AddScript optt="CE" index={index} vy={vy} ws={ws} />
      )}
      {peScript ? (
        <Scripts optt="PE" index={index} vy={vy} script={peScript} ws={ws} />
      ) : (
        <AddScript optt="PE" index={index} vy={vy} ws={ws} />
      )}
    </div>
  );
};

export default Watchlist;
