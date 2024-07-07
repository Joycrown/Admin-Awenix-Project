function LoadingScreen() {
  return (
    <div className="fixed w-full h-screen left-0 top-0 z-[1001] flex items-center justify-center">
      <div className="absolute w-full h-full bg-black bg-opacity-85" />
      <div className="relative flex justify-center items-center">
        <div className="absolute animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        <img src="/awenix.png" className="rounded-full h-8 w-8" />
      </div>
    </div>
  );
}

export default LoadingScreen;
