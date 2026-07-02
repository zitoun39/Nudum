import { Module } from "@nestjs/common";
import { SitesService } from "./sites.service";
import { SitesController } from "./sites.controller";
import { StationsService } from "./stations.service";
import { StationsController } from "./stations.controller";
import { EquipmentService } from "./equipment.service";
import { EquipmentController } from "./equipment.controller";
import { MeasurementsService } from "./measurements.service";
import { MeasurementsController } from "./measurements.controller";

@Module({
  controllers: [SitesController, StationsController, EquipmentController, MeasurementsController],
  providers: [SitesService, StationsService, EquipmentService, MeasurementsService],
  exports: [SitesService, StationsService, EquipmentService, MeasurementsService]
})
export class MahattatiModule {}
