// import { HardhatRuntimeEnvironment } from "hardhat/types";
// import { DeployFunction } from "hardhat-deploy/types";

// const deployCoffeeStore: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const { deployments, getNamedAccounts, ethers } = hre;
//   const { deploy } = deployments;
//   const { deployer } = await getNamedAccounts();

//   // ✅ 获取已部署的 EthVoting 合约地址
//   const ethVotingDeployment = await deployments.get("EthVoting");
//   const ethVotingAddress = ethVotingDeployment.address;

//   // ✅ 传入地址作为构造参数部署 CoffeeStore
//   await deploy("CoffeeStore", {
//     from: deployer,
//     args: [ethVotingAddress], // 构造参数传入
//     log: true,
//     autoMine: true,
//   });

//   console.log("✅ CoffeeStore 部署完成，使用的 EthVoting 地址为:", ethVotingAddress);
// };

// export default deployCoffeeStore;

// deployCoffeeStore.tags = ["CoffeeStore"];
