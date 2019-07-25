
export async function runStep({ condition, action, context }) {
  if (condition) {
    return await action(context);
  }
}
