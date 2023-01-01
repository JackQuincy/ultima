import { ButtonLink, DiscordButton, Header } from "@ff6wc/ui";
import useSWR from "swr";
import SpriteDrawLoad from "~/components/SpriteDrawLoad/SpriteDrawLoad";

export type AppHeaderProps = Record<string, unknown>;

type RandomPayload = {
  sprite_id: number;
  palette_id: number;
  pose_id: number;
};

const useRandomSprite = () => {
  return useSWR<RandomPayload>(["/api/sprite/random"], async () => {
    const response = await fetch("/api/sprite/random");
    const data = await response.json();
    return data;
  });
};

export const AppHeader = (props: AppHeaderProps) => {
  const { data } = useRandomSprite();
  const { palette_id, pose_id, sprite_id } = data ?? {};
  const showSprite =
    Number.isFinite(palette_id) &&
    Number.isFinite(pose_id) &&
    Number.isFinite(sprite_id);
  return (
    <div>
      <Header className={"flex"}>
        {/* <div className="flex gap-3 flex-wrap justify-center"></div> */}
      </Header>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-5">
        <ButtonLink className="w-fit" href="/sotw">
          {showSprite ? (
            <SpriteDrawLoad
              paletteId={palette_id as number}
              poseId={pose_id as number}
              spriteId={sprite_id as number}
              scale={2}
              variant={"half"}
            />
          ) : null}
          <div>
            <p className={"hidden md:inline"}>Seed of the Week</p>
            <p className={"inline md:hidden"}>Seed of the Week</p>
          </div>
        </ButtonLink>
        <DiscordButton />
      </div>
    </div>
  );
};
