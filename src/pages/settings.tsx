function Settings() {
  return (
    <section className="py-2 space-y-4">
      <div className="space-y-2">
        <h4 className="font-semibold text-xl">Settings</h4>
        <p>Invite an admin</p>
      </div>

      <form className="w-full space-y-4">
        <input
          type="email"
          placeholder="Email address of the admin you want to invite"
          className="bg-transparent border border-default-200 w-full outline-none p-3 rounded font-normal focus:border-default-300"
        />
        <button className="bg-default-500 text-white py-3 px-4 cursor-pointer rounded">
          Send Invite
        </button>
      </form>
    </section>
  );
}

export default Settings;
