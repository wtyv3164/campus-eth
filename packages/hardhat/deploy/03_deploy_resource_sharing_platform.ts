import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
// 可以查看test文件夹下的test.ts文件

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployResourceSharingPlatform: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK which will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */

  // const { deployments, getNamedAccounts, ethers } = hre;
  // const { deploy } = deployments;
  // const { deployer } = await getNamedAccounts();

  const { deployer } = await hre.getNamedAccounts(); //合约部署者地址
  const { deploy } = hre.deployments; //部署

  //获取已部署合约地址
  const yc = await hre.deployments.get("CampusShareToken");
  const ycAddress = yc.address;

  //修改为自己的合约名字
  await deploy("ResourceSharingPlatform", {
    from: deployer,
    // Contract constructor arguments
    args: [ycAddress], // 这个与构造器有关，若构造器constructor不需要传参，则args传参为空
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  await hre.ethers.getContract<Contract>("ResourceSharingPlatform", deployer); //这里是合约的名字
  // console.log("👋 Initial greeting:", await ResourceSharingPlatform.greeting());合约中没有greeting方法
};

export default deployResourceSharingPlatform;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployResourceSharingPlatform.tags = ["ResourceSharingPlatform"];
