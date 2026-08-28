/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Post } from "./pages/Post";
import { About } from "./pages/About";
import { Photography } from "./pages/Photography";
import { ScrollToTop } from "./components/ScrollToTop";
import { DiaryProvider } from "./context/DiaryContext";
import { GoogleDriveProvider } from "./context/GoogleDriveContext";
import { WriteDiaryModal } from "./components/WriteDiaryModal";
import { GoogleDriveModal } from "./components/GoogleDriveModal";

export default function App() {
  return (
    <DiaryProvider>
      <GoogleDriveProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/post/:slug" element={<Post />} />
          </Routes>
          <WriteDiaryModal />
          <GoogleDriveModal />
        </BrowserRouter>
      </GoogleDriveProvider>
    </DiaryProvider>
  );
}

