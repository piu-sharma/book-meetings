const ErrorMessage = ({ errorMsg }: { errorMsg: string }) => {
	return (
		<div className="tw-p-2 tw-bg-red-500 tw-text-slate-50">{errorMsg}</div>
	);
};

export { ErrorMessage };
