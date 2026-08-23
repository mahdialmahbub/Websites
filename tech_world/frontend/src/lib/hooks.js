// Plain re-export — since this is a JavaScript project there's no typed-hook
// boilerplate needed, but importing from one central place makes it a
// one-line change later if you ever add TypeScript.
export { useDispatch as useAppDispatch, useSelector as useAppSelector } from "react-redux";
