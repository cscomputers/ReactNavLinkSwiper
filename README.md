# ReactNavLinkSwiper
Receive a array of contents and return a cliked indice value.

Works like a scrolled items, you may scroll the values for left and right, the default value is positioned on center.

This is a module, a component for react. call this using a tag <NavLinkSwipper ... with props. Ex:

render() {
  const linkArray = ['10.00', '25.00', '28.00'],
}
<NavLinkSwiper
  linkArray={linkArray}
  selectedIndex='2'  // Or a function...
  isLoading={false}
  beforeChange={this.onChangePosition} // A custom async method, this receives the index on the parameter, and you may set in state and change your values... 
/>
