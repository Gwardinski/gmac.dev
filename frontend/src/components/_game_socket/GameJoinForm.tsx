// import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
// import { useForm } from "@tanstack/react-form";
// import { Button, Input } from "../ui";
// import { COLORS, type Color } from "./game-state";
// import { gameJoin } from "./useGetGameState";

// export const GameJoinForm = () => {

//   const savedPlayerName = localStorage.getItem("player-name") || "";
//   const savedRoomCode = localStorage.getItem("room-code") || "";
//   const savedPlayerColor = (localStorage.getItem("player-color") as Color) || "RED";

//   const form = useForm({
//     defaultValues: {
//       playerName: savedPlayerName,
//       roomCode: savedRoomCode,
//       playerColor: savedPlayerColor,
//     },
//     onSubmit: async ({ value }) => {
//       gameJoin(value.roomCode, value.playerName, value.playerColor);
//     },
//   });

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         form.handleSubmit();
//       }}
//       className="flex flex-col w-full max-w-sm gap-2 p-4 rounded-md items-center glass dark:dark-glass"
//     >
//       <form.Field
//         name="playerName"
//         validators={{
//           onSubmit: ({ value }) => {
//             if (value.length < 3) {
//               return "3 characters min!";
//             }
//             if (value.length > 10) {
//               return "10 characters max!";
//             }
//             return undefined;
//           },
//         }}
//       >
//         {(field) => (
//           <div className="w-full">
//             <Input
//               type="text"
//               placeholder="Player Name"
//               className="text-center font-mono"
//               value={field.state.value}
//               onChange={(e) => field.handleChange(e.target.value)}
//               onBlur={field.handleBlur}
//             />
//             {field.state.meta.errors.length > 0 && (
//               <p className="text-xs text-red-500 mt-1 text-center">
//                 {field.state.meta.errors[0]}
//               </p>
//             )}
//           </div>
//         )}
//       </form.Field>

//       <form.Field name="playerColor">
//         {(field) => (
//           <RadioGroup
//             value={field.state.value}
//             onValueChange={(value) => field.handleChange(value as Color)}
//             className="flex gap-2 flex-wrap pb-4 justify-center"
//           >
//             {COLORS.map((color) => (
//               <label
//                 key={color}
//                 className="relative cursor-pointer"
//                 title={color}
//               >
//                 <RadioGroupItem
//                   value={color}
//                   className={`size-10 border-2 ${field.state.value === color
//                     ? "ring-2 ring-offset-2 ring-offset-background"
//                     : ""
//                     }`}
//                   style={{
//                     backgroundColor: color.toLowerCase(),
//                   }}
//                 />
//               </label>
//             ))}
//           </RadioGroup>
//         )}
//       </form.Field>

//       <form.Field
//         name="roomCode"
//         validators={{
//           onSubmit: ({ value }) => {
//             if (value.length !== 4) {
//               return "4 Digit Code";
//             }
//             return undefined;
//           },
//         }}
//       >
//         {(field) => (
//           <div className="w-full">
//             <Input
//               type="text"
//               placeholder="Room Code"
//               className="text-center font-mono tracking-widest uppercase"
//               maxLength={4}
//               value={field.state.value}
//               onChange={(e) => field.handleChange(e.target.value.toUpperCase())}
//               onBlur={field.handleBlur}
//             />
//             {field.state.meta.errors.length > 0 && (
//               <p className="text-xs text-red-500 mt-1 text-center">
//                 {field.state.meta.errors[0]}
//               </p>
//             )}
//           </div>
//         )}
//       </form.Field>

//       <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
//         {([canSubmit, isSubmitting]) => (
//           <Button className="w-full" type="submit" disabled={!canSubmit || isSubmitting}>
//             {isSubmitting ? "Joining..." : "Join Game"}
//           </Button>
//         )}
//       </form.Subscribe>
//     </form>
//   );
// };
