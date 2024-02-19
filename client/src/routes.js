import { lazy } from "react";

import Home from "./pages/communitypages/Home";
import Profile from "./pages/communitypages/Profile";
import Post from "./pages/communitypages/Post";
import OwnPost from "./pages/communitypages/OwnPost";
import CommunityHome from "./pages/communitypages/CommunityHome";
import Saved from "./pages/communitypages/Saved";
import PublicProfile from "./pages/communitypages/PublicProfile";
import AllCommunities from "./pages/communitypages/AllCommunities";
import MyCommunities from "./pages/communitypages/MyCommunities";
import Following from "./pages/communitypages/Following";
import SignUp from "./pages/communitypages/SignUp";

const ReportedPost = lazy(() => import("./pages/communitypages/ReportedPost"));
const Moderator = lazy(() => import("./pages/communitypages/Moderator"));
const DevicesLocations = lazy(() => import("./pages/communitypages/DevicesLocations"));
const VerifyEmail = lazy(() => import("./pages/communitypages/VerifyEmail"));
const EmailVerifiedMessage = lazy(() => import("./pages/communitypages/EmailVerifiedMessage"));
const BlockDevice = lazy(() => import("./pages/communitypages/BlockDevice"));
const LoginVerified = lazy(() => import("./pages/communitypages/LoginVerified"));
const AccessDenied = lazy(() => import("./pages/communitypages/AccessDenied"));
const NotFound = lazy(() => import("./pages/communitypages/NotFound"));

export const privateRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/post/:postId",
    element: <Post />,
  },
  {
    path: "/my/post/:postId",
    element: <OwnPost />,
  },
  {
    path: "/community/:communityName",
    element: <CommunityHome />,
  },
  {
    path: "/community/:communityName/reported-post",
    element: <ReportedPost />,
  },
  {
    path: "/community/:communityName/moderator",
    element: <Moderator />,
  },
  {
    path: "/saved",
    element: <Saved />,
  },
  {
    path: "/user/:userId",
    element: <PublicProfile />,
  },
  {
    path: "/communities",
    element: <AllCommunities />,
  },
  {
    path: "/my-communities",
    element: <MyCommunities />,
  },
  {
    path: "/following",
    element: <Following />,
  },
  {
    path: "/devices-locations",
    element: <DevicesLocations />,
  },
];

export const publicRoutes = [
  {
    path: "/signup",
    element: <SignUp />,
  },

  {
    path: "/auth/verify",
    element: <VerifyEmail />,
  },
  {
    path: "/email-verified",
    element: <EmailVerifiedMessage />,
  },
  {
    path: "/block-device",
    element: <BlockDevice />,
  },
  {
    path: "/verify-login",
    element: <LoginVerified />,
  },
  {
    path: "/access-denied",
    element: <AccessDenied />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
